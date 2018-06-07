import { initNimSDK } from './initNimSDK'
import cookie from '../../utils/cookie'
import util from '../../utils'
import {convertBase64UrlToBlob} from '../../utils/img'
import {openDB,saveData,deleteOneData,deleteDataByKey,searchData,getDataByIndex,updateData} from './indexDBInit'
import { onSessions, onUpdateSession, setCurrSession, resetCurrSession,deleteSession } from './session.js'
import {getLocalHistoryMsgs, sendMsg,updateMsg, resetNoMoreHistoryMsgs,buildAndPutMsg,sendVideoMsg,sendImgMsg,sendAudioMsg,updateFailMsg } from './msgs'
import {checkHaveBindDoctor} from './huiguApi'

function connectNim({ state, commit, dispatch }, obj) {
    let { force } = Object.assign({}, obj)
    // 操作为内容页刷新页面，此时无nim实例
    if (!state.nim || force) {
        let loginInfo = getUserCookieInfo()
        if (!loginInfo.uid) {
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
        userName: cookie.readLocal('ofPatientName'),
        userAvatar: cookie.readLocal('iconUrl'),
        userType: cookie.readLocal('userType')
    }
}
function userLogoOut(){
    cookie.delLocal('patientAccid'),
    cookie.delLocal('patientImToken'),
    cookie.delLocal('ofPatientId'),
    cookie.delLocal('patientAccid'),
    cookie.delLocal('ofPatientName'),
    cookie.delLocal('iconUrl'),
    cookie.delLocal('userType')

    cookie.delCookie('token')
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
        if(loginInfo.uid && loginInfo.sdktoken && state.connectStatus !== 0){
            dispatch('connect')
        }
        if(userInfoCompare(loginInfo,state.myInfo)) return
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
    updateIsQuestionSubmit({ state, commit },status){
        commit('updateIsQuestionSubmit', status)
    },
    updateChatMsgStatus({ state, commit },status){
        commit('updateChatMsgStatus', status)
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
    updateRefreshState({ commit }) {
        commit('updateRefreshState')
    },
    updatedLoadingStatus(store, { status }) {
        store.commit('updateLoadingStatus', { status })
    },
    deleteSessions(store, { sessionId }) {
        store.commit('deleteSessions', [sessionId])
        store.dispatch('deleteDataByKey', {key:sessionId,table:'Msgs'})
    },
    openDB(store,callback){
        let loginInfo = getUserCookieInfo()
        if (loginInfo.uid) {
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
    // 重置当前会话
    resetCurrSession,
    //发送普通消息
    buildAndPutMsg,
    sendMsg,
    onUpdateSession,
    updateMsg,
    sendVideoMsg,
    sendImgMsg,
    sendAudioMsg,
    resetNoMoreHistoryMsgs,
    getLocalHistoryMsgs,
    checkHaveBindDoctor,
    userLogoOut,
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
        let msgTypeMap = store.state.msgTypeMap
        let msgType = msgTypeMap[msg.messageContentType]
        switch(msgType){
            case 'audio': 
                resendMsgFn(store,msg,(newMsg)=>{
                    store.dispatch('sendAudioMsg',{serverId:newMsg['mediaContent']['serverId'],msg:newMsg})
                },'success')
                ;break;
            case 'image': 
                resendMsgFn(store,msg,(newMsg)=>{
                    let blob = convertBase64UrlToBlob(cookie.readLocal(newMsg.mediaContent.fileDataLocalPath))

                    store.dispatch('sendImgMsg',{file:blob,msg:newMsg})
                })
                ;break;
            case 'video': 
                resendMsgFn(store,msg,(newMsg)=>{
                    urlChangeToBlob(newMsg.mediaContent.fileDataLocalPath).then((blob)=>{
                        if(blob){
                            store.dispatch('sendVideoMsg',{file:blob,msg:newMsg})
                        }else{
                            updateFailMsg(null,newMsg)
                        }
                    })
                })
                ;break;
            default:
                resendMsgFn(store,msg,(newMsg)=>{
                    store.dispatch('sendMsg',newMsg)//普通文本消息
                })
                ;break;
        }
    }
}

function urlChangeToBlob(url){
    return new Promise((resolve)=>{
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
            if (this.status == 200) {//请求成功
                var blob = this.response;
                resolve(blob)
            }
        };
        xhr.onerror = function(e){
            resolve()
        }
        xhr.send();
    })
}

function resendMsgFn(store,msg,callback,status){
    store.commit('deleteMsg',msg)
    deleteOneData(msg.id,'Msgs',()=>{
        store.dispatch('buildAndPutMsg',{callback:(newMsg)=>{
            //开始发送
            callback&&callback(newMsg)
        },content:{
            mediaContent:msg.mediaContent,
            messageContentType: msg.messageContentType,
            textContent: msg.textContent
        },status})
    })
}

export default indexActions