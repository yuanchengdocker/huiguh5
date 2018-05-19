import { initNimSDK } from './initNimSDK'
import cookie from '../../utils/cookie'
import {openDB,saveData,deleteOneData,deleteDataByKey,searchData,getDataByIndex,updateData} from './indexDBInit'
import { onSessions, onUpdateSession, setCurrSession, resetCurrSession,deleteSession } from './session.js'
import {getLocalHistoryMsgs, sendMsg, sendMsgReceipt, resetNoMoreHistoryMsgs } from './msgs'

function connectNim({ state, commit, dispatch }, obj) {
    let { force } = Object.assign({}, obj)
    // 操作为内容页刷新页面，此时无nim实例
    if (!state.nim || force) {
        let loginInfo = {
            uid: cookie.readCookie('uid'),
            sdktoken: cookie.readCookie('sdktoken'),
            id: cookie.readCookie('id'),
            userAccid: cookie.readCookie('uid'),
            userName: cookie.readCookie('userName'),
            userAvatar: cookie.readCookie('userAvatar'),
            userType: cookie.readCookie('userType')
        }
        if (!loginInfo.uid) {
            // 无cookie，直接跳转登录页
            console.log('无历史登录记录，请重新登录', 'login')
        } else {
            // 有cookie，重新登录
            dispatch('initNimSDK', loginInfo)
        }
    }
}

let indexActions = {
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
        let loginInfo = {
            uid: cookie.readCookie('uid'),
            sdktoken: cookie.readCookie('sdktoken'),
        }
        if (!loginInfo.uid) {
            // 无cookie，直接跳转登录页
            console.log('无历史登录记录，请重新登录', 'login')
        } else {
            // 有cookie，重新登录
            openDB(loginInfo)
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
        msg.type = 'custom'
        msg.content = JSON.parse(msg.content)
        store.dispatch('sendMsg',msg)
        deleteOneData(id,'Msgs')
        store.commit('deleteMsgById',msg)
    }
}

export default indexActions