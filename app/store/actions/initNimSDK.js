/*
 * SDK连接相关
 */

import config from '../../config/nim.config.js'
import store from '../'
import { onSessions, onUpdateSession } from './session.js'
import { onRoamingMsgs, onOfflineMsgs, onMsg,sendMsg,sendFileMsg } from './msgs'

const SDK = require('../../sdk/' + config.sdk)

// 重新初始化 NIM SDK
export function initNimSDK({ state, commit, dispatch }, loginInfo) {
    if (state.nim) {
        state.nim.disconnect()
    }
    // dispatch('updatedLoadingStatus', { status: true })
    dispatch('updateConnectStatus',2)//收取中
    // 初始化SDK
    window.nim = state.nim = SDK.NIM.getInstance({
        // debug: true && { api: 'info', style: 'font-size:12px;color:blue;background-color:rgba(0,0,0,0.1)' },
        appKey: config.appkey,
        account: loginInfo.uid,
        token: loginInfo.sdktoken,
        db: false,
        needReconnect:true,
        syncSessionUnread: true,
        syncRobots: true,
        autoMarkRead: true, // 默认为true
        onconnect: function onConnect(event) {
            if (loginInfo) {
                // 连接上以后更新uid
                // dispatch('updateConnectStatus',0)//收取完成
            }
        },
        onerror: function onError(event) {
            // alert(JSON.stringify(event))
            dispatch('updateConnectStatus',1)//未连接
            // location.href = config.loginUrl
        },
        onwillreconnect: function onWillReconnect() {
            dispatch('updateConnectStatus',3)//重连中
        },
        ondisconnect: function onDisconnect(error) {
            dispatch('updateConnectStatus',1)//未连接
        },

        // onsessions: onSessions,
        // onupdatesession: onUpdateSession,
        // onroamingmsgs: onRoamingMsgs,
        onofflinemsgs: onOfflineMsgs,
        onmsg: onMsg,
        // 用户名片 - actions/userInfo
        // onmyinfo: onMyInfo,
        // onupdatemyinfo: onMyInfo,
        // onusers: onUserInfo,
        // onupdateuser: onUserInfo,
        // // 同步完成
        onsyncdone: function onSyncDone() {
            // dispatch('updatedLoadingStatus', { status: false })
            dispatch('updateConnectStatus',0)
            // 说明在聊天列表页
            if (store.state.currSessionId) {
                dispatch('setCurrSession', store.state.currSessionId)
            }
        }
    })
}


