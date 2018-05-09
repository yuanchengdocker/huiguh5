import { initNimSDK } from './initNimSDK'
import cookie from '../../utils/cookie'
import {resetSearchResult, searchUsers, searchTeam} from './search'
import { onSessions, onUpdateSession, setCurrSession, resetCurrSession } from './session.js'
import { getLocalSessionMsg, sendMsg, sendFileMsg, sendMsgReceipt, sendRobotMsg, revocateMsg, getHistoryMsgs, resetNoMoreHistoryMsgs, continueRobotMsg } from './msgs'

function connectNim({ state, commit, dispatch }, obj) {
    let { force } = Object.assign({}, obj)
    // 操作为内容页刷新页面，此时无nim实例
    if (!state.nim || force) {
        let loginInfo = {
            uid: cookie.readCookie('uid'),
            sdktoken: cookie.readCookie('sdktoken'),
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
    //已读回调
    sendMsgReceipt,
    //发送普通消息
    sendMsg,
    sendFileMsg,
    getHistoryMsgs,
    resetNoMoreHistoryMsgs,
    searchUsers,
    getLocalSessionMsg
}

export default indexActions