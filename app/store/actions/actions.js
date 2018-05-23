import { initNimSDK } from './initNimSDK'
import cookie from '../../utils/cookie'
import util from '../../utils'
import {openDB,saveData,deleteOneData,deleteDataByKey,searchData,getDataByIndex,updateData} from './indexDBInit'
import { onSessions, onUpdateSession, setCurrSession, resetCurrSession,deleteSession } from './session.js'
import {getLocalHistoryMsgs, sendMsg, sendMsgReceipt, resetNoMoreHistoryMsgs } from './msgs'
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
            dispatch('updateConnectStatus',4)//收取中
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

let indexActions = {
    updateMyInfor({ state, commit,dispatch }, loginInfo){
        if(!loginInfo){
            loginInfo = getUserCookieInfo()
        }
        let userInfo = {
            id:loginInfo.id,
            userName:loginInfo.userName,
            userAccid:loginInfo.userAccid,
            userAvatar:loginInfo.userAvatar,
            userType:loginInfo.userType
        }
        let myInfo = {
            id:state.myInfo.id,
            userName:state.myInfo.userName,
            userAccid:state.myInfo.userAccid,
            userAvatar:state.myInfo.userAvatar,
            userType:state.myInfo.userType
        }
        if(util.objCmp(myInfo,userInfo)) return
        console.log('my不同')
        commit('updateUserUID', loginInfo)
        dispatch('updateUserInfor',userInfo)
    },
    updateUserInfor({ state, commit,dispatch }, users){
        let update = false
        if(users && !Array.isArray(users)) users = [users]
        for(let i=0;i<users.length;i++){
            let userInfo = users[i]
            let userAccid = userInfo.userAccid
            if(!state.userInfos[userAccid]){
                update = true
                break
            }
            let userInfoState = {
                id:state.userInfos[userAccid].id,
                userName:state.userInfos[userAccid].userName,
                userAccid:state.userInfos[userAccid].userAccid,
                userAvatar:state.userInfos[userAccid].userAvatar,
                userType:state.userInfos[userAccid].userType
            }
            if(!util.objCmp(userInfoState,userInfo)){
                update = true
                break
            }
        }
        
        if(!update) return
        console.log('user不同')
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
    openDB(store){
        let loginInfo = getUserCookieInfo()
        if (!loginInfo.uid) {
            console.log('无历史登录记录，请重新登录', 'login')
        } else {
            // 有cookie，重新登录
            openDB()
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
    //已读回调
    sendMsgReceipt,
    //发送普通消息
    sendMsg,
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
    resendMsg(store,{id,msg}){
        let msg2 = {}
        Object.assign(msg2,msg)
        msg2.type = 'custom'
        msg2.content = JSON.parse(msg2.content)
        store.dispatch('sendMsg',msg2)
        deleteOneData(id,'Msgs')
        store.commit('deleteMsgById',msg2)
    }
}

export default indexActions