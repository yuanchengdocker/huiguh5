import { initNimSDK } from './initNimSDK'
import cookie from '../../utils/cookie'
import util from '../../utils'
import {openDB,saveData,deleteOneData,deleteDataByKey,searchData,getDataByIndex,updateData} from './indexDBInit'
import { onSessions, onUpdateSession, setCurrSession, resetCurrSession,deleteSession } from './session.js'
import {getLocalHistoryMsgs, sendMsg,updateMsg, resetNoMoreHistoryMsgs,buildAndPutMsg,sendVideoMsg,sendImgMsg,sendAudioMsg } from './msgs'
import {checkHaveBindDoctor} from './huiguApi'
import Vue from 'vue'

function connectNim({ state, commit, dispatch }, obj) {
    let { force } = Object.assign({}, obj)
    // 操作为内容页刷新页面，此时无nim实例
    if (!state.nim || force) {
        let loginInfo = getUserCookieInfo()
        if (!loginInfo.uid) {
            // 无cookie，直接跳转登录页
            console.log('无历史登录记录，请重新登录', 'login')
            dispatch('updateConnectStatus',4)//未登录
            return
        } else {
            // 有cookie，重新登录
            dispatch('initNimSDK', loginInfo)
            dispatch('updateUserInfor', loginInfo)
        }
    }
}

function getUserCookieInfo(){
    return {
        uid: cookie.readLocal('patientAccid'),
        sdktoken: cookie.readLocal('patientImToken'),
        id: cookie.readLocal('ofPatientId'),
        userAccid: cookie.readLocal('patientAccid'),
        userName: cookie.readLocal('mobilePhone'),
        userAvatar: cookie.readLocal('iconUrl'),
        userType: cookie.readLocal('userType')
    }
}
function getUserInfo(loginInfo){
    if(!loginInfo) loginInfo = {}
    return {
        id:loginInfo.id,
        userName:loginInfo.userName,
        userAccid:loginInfo.userAccid,
        userAvatar:loginInfo.userAvatar,
        userType:loginInfo.userType
    }
}
function userInfoCompare(user1,user2){
    let user1Info = getUserInfo(user1)
    let user2Info = getUserInfo(user2)
    if(util.objCmp(user1Info,user2Info)){
        return true
    }
    return false
}

let indexActions = {
    updateMyInfor({ state, commit,dispatch }, loginInfo){
        if(!loginInfo){
            loginInfo = getUserCookieInfo()
        }
        if(userInfoCompare(loginInfo,state.myInfo)) return
        console.log('my不同')
        commit('updateUserUID', loginInfo)
        dispatch('updateUserInfor',loginInfo)
    },
    updateUserInfor({ state, commit,dispatch }, users){
        let update = false
        if(users && !Array.isArray(users)) users = [users]
        for(let i=0;i<users.length;i++){
            let userInfo = users[i]
            let userAccid = userInfo.userAccid
            if(!userInfoCompare(state.userInfos[userAccid],userInfo)){
                update = true
                break
            }
        }
        
        if(!update) return
        console.log('user不同')
        users = users.map((user)=>getUserInfo(user))
        commit('updateUserInfo',users)
        dispatch('saveData', {obj:users,table:'Users'})
    },
    // 显示原图片
    showFullscreenImg({ state, commit }, obj) {
        if (obj) {
            obj.type = 'show'
            commit('updateFullscreenImage', obj)
        }
    },
    // 隐藏原图片
    hideFullscreenImg({ state, commit }) {
        commit('updateFullscreenImage', {
            type: 'hide'
        })
    },
    // 显示原视频
    showFullscreenVideo({ state, commit }, obj) {
        if (obj) {
            obj.type = 'show'
            commit('updateFullscreenVideo', obj)
        }
    },
    // 隐藏原视频
    hideFullscreenVideo({ state, commit }) {
        commit('updateFullscreenVideo', {
            type: 'hide'
        })
    },
    loadToad({ state, commit },msg){
        commit('loadToad', msg)
    },
    updateCurrMsgAudioId({ state, commit },id){
        commit('updateCurrMsgAudioId', id)
    },
    updateConnectStatus({ state, commit },status){
        state.connectStatus = status
    },
    updateChatLoading({ state, commit },show){
        commit('updateChatLoading', show)
    },
    showLoading({ state, commit }) {
        commit('showLoading')
    },
    hideLoading({ state, commit }) {
        commit('hideLoading')
    },
    setCurrRoute({ state, commit }, route) {
        commit('setCurrRoute', route)
    },
    updateMenuBarShow({ state, commit }, isShow) {
        commit('updateMenuBarShow', isShow)
    },
    updateRefreshState({ commit }) {
        commit('updateRefreshState')
    },
    updatedLoadingStatus(store, { status }) {
        store.commit('updateLoadingStatus', { status })
    },
    deleteSessions(store, { sessionId }) {
        store.commit('deleteSessions', [sessionId])
    },
    openDB(store,callback){
        let loginInfo = getUserCookieInfo()
        if (!loginInfo.uid) {
            console.log('无历史登录记录，请重新登录', 'login')
        } else {
            // 有cookie，重新登录
            openDB(callback)
        }
    },
    // 连接sdk请求，false表示强制重连
    connect(store, obj) {
        let { type } = Object.assign({}, obj)
        
        // type 可为 nim chatroom
        type = type || 'nim'
        switch (type) {
            case 'nim':
                connectNim(store, obj)
                break
            case 'chatroom':
                connectChatroom(store, obj)
                break
        }
    },
    // 用户触发的登出逻辑
    logout({ state, commit }) {
        cookie.delCookie('uid')
        cookie.delCookie('sdktoken')
        if (state.nim) {
            state.nim.disconnect()
        }
        // pageUtil.turnPage('', 'login')
    },
    initNimSDK,
    // 设置当前会话
    setCurrSession,
    deleteSession,
    // 重置当前会话
    resetCurrSession,
    //发送普通消息
    buildAndPutMsg,
    sendMsg,
    updateMsg,
    sendVideoMsg,
    sendImgMsg,
    sendAudioMsg,
    resetNoMoreHistoryMsgs,
    getLocalHistoryMsgs,
    checkHaveBindDoctor,
    deleteOneData(store, {id,table,callback}){
        deleteOneData(id,table,callback)
    },
    deleteDataByKey(store, {key,table}){
        deleteDataByKey(key,table)
    },
    saveData(store, {obj,table}){
        saveData(obj,table)
    },
    searchData(store,{callback,table}){
        searchData(callback,table)
    },
    getDataByIndex(store,{callback,table,id}){
        getDataByIndex(callback,table,id)
    },
    updateData(store,{data,table}){
        updateData(data,table)
    },
    resendMsg(store,{msg}){
        let msg2 = util.buildSelfDefinedMsg(msg,'fail')
        store.commit('deleteMsg',msg)
        deleteOneData(msg.id,'Msgs',()=>{
            store.commit('putMsg', msg2)
            store.commit('updateCurrSessionMsgs', {
                type: 'put',
                msg: msg2
            })
            store.dispatch('saveData', {obj:msg2,table:'Msgs'})
            store.dispatch('sendMsg',msg2)
        })

    }
}

export default indexActions