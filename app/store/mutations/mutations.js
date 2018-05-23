// 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
// this.$store.commit(method, params)

import store from '../'
import cookie from '../../utils/cookie'
import util from '../../utils'
import config from '../../config/nim.config.js'

export default {
    updateCurrMsgAudioId(state,id){
        state.currMsgAudioId = id
    },
    loadToad(state,msg){
        state.showToastMsg = msg
    },
    updateCurrDoctorBind(state,isBind){
        state.currDoctorBind = isBind
    },
    updateMsgLastTime(state,time){
        state.msgLastTime = time
    },
    updateChatLoading(state,show){
        state.isChatLoading = show
    },
    showLoading(state){
        state.loadingStatus = true
    },
    hideLoading(state){
        state.loadingStatus = false
    },
    setCurrRoute(state, route){
        state.route = route
    },
    updateMenuBarShow(state, isShow) {
        state.showMenuBar = isShow
    },
    updateLoadingStatus(state, { status }) {
        state.loadingStatus = status
    },
    updateRefreshState(state) {
        state.isRefresh = false
    },
    updateLoading(state, status) {
        clearTimeout(state.loadingTimer)
        state.loadingTimer = setTimeout(() => {
            state.isLoading = status
        }, 20)
    },
    updateFullscreenVideo(state, obj) {
        obj = obj || {}
        if (obj.src && obj.type === 'show') {
            state.fullscreenVideo = obj
            state.isFullscreenVideoShow = true
        } else if (obj.type === 'hide') {
            state.fullscreenVideo = {}
            state.isFullscreenVideoShow = false
        }
    },
    updateFullscreenImage(state, obj) {
        obj = obj || {}
        if (obj.src && obj.type === 'show') {
            state.fullscreenImgSrc = obj.src
            state.isFullscreenImgShow = true
        } else if (obj.type === 'hide') {
            state.fullscreenImgSrc = ' '
            state.isFullscreenImgShow = false
        }
    },
    updateUserUID(state, loginInfo) {
        state.userUID = loginInfo.uid
        state.sdktoken = loginInfo.sdktoken
        state.myInfo = util.mergeObject(state.myInfo, loginInfo)
        // cookie.setCookie('uid', loginInfo.uid)
        // cookie.setCookie('sdktoken', loginInfo.sdktoken)
    },
    // updateMyInfo(state, myInfo) {
    //     state.myInfo = util.mergeObject(state.myInfo, myInfo)
    // },
    updateUserInfo(state, users) {
        let userInfos = state.userInfos
        users.forEach(user => {
            let userAccid = user.userAccid
            if (userAccid) {
                userInfos[userAccid] = util.mergeObject(userInfos[userAccid], user)
            }
        })
        state.userInfos = util.mergeObject(state.userInfos, userInfos)
    },
    updateSessions(state, sessions) {
        const nim = state.nim
        let unReadCount = 0
        let totalSessions = nim.mergeSessions(state.sessionlist, sessions)
        totalSessions.sort((a, b) => {
            return b.updateTime - a.updateTime
        })
        totalSessions.forEach(item => {
            if(item.scene === 'p2p'){
                state.sessionMap[item.id] = item
                unReadCount += item.unread
            }
        })
        state.sessionlist = totalSessions
        state.sessionUnreadCount = unReadCount
    },
    deleteSessions(state, sessionIds) {
        const nim = state.nim
        state.sessionlist = nim.cutSessionsByIds(state.sessionlist, sessionIds)
    },
    // 初始化，收到离线漫游消息时调用
    updateMsgs(state, msgs) {
        const nim = state.nim
        let tempSessionMap = {}
        msgs.forEach(msg => {
            let sessionId = msg.sessionId
            tempSessionMap[sessionId] = true
            if (!state.msgs[sessionId]) {
                state.msgs[sessionId] = []
            }
            // sdk会做消息去重
            // state.msgs[sessionId] = nim.mergeMsgs(state.msgs[sessionId], [msg])
            state.msgs[sessionId].push(msg)
        })
        store.commit('updateMsgByIdClient', msgs)
        for (let sessionId in tempSessionMap) {
            state.msgs[sessionId].sort((a, b) => {
                if (a.time === b.time) {
                    // 机器人消息，回复消息时间和提问消息时间相同，提问在前，回复在后
                    if (a.type === 'robot' && b.type === 'robot') {
                        if (a.content && a.content.msgOut) {
                            return 1
                        }
                        if (b.content && b.content.msgOut) {
                            return -1
                        }
                    }
                }
                return a.time - b.time
            })
            if (sessionId === state.currSessionId) {
                store.commit('updateCurrSessionMsgs', {
                    type: 'init'
                })
            }
        }
    },
    // 更新追加消息，追加一条消息
    putMsg(state, msg) {
        let sessionId = msg.sessionId
        if (!state.msgs[sessionId]) {
            state.msgs[sessionId] = []
        }
        store.commit('updateMsgByIdClient', msg)
        let tempMsgs = state.msgs[sessionId]
        let lastMsgIndex = tempMsgs.length - 1
        if (tempMsgs.length === 0 || msg.time >= tempMsgs[lastMsgIndex].time) {
            state.currSessionLastMsg = msg
            tempMsgs.push(msg)
        } else {
            for (let i = lastMsgIndex; i >= 0; i--) {
                let currMsg = tempMsgs[i]
                if (msg.time >= currMsg.time) {
                    state.msgs[sessionId].splice(i, 0, msg)
                    break
                }
            }
        }
    },
    // 删除消息列表消息
    deleteMsg(state, msg) {
        let sessionId = msg.sessionId
        let tempMsgs = state.msgs[sessionId]
        if (!tempMsgs || tempMsgs.length === 0) {
            return
        }
        let lastMsgIndex = tempMsgs.length - 1
        for (let i = lastMsgIndex; i >= 0; i--) {
            let currMsg = tempMsgs[i]
            if (msg.idClient === currMsg.idClient) {
                state.msgs[sessionId].splice(i, 1)
                state.currSessionMsgs.splice(i, 1)
                break
            }
        }
    },
    // 替换消息列表消息，如消息撤回
    deleteMsgById(state, msg) {
        let { sessionId, id } = msg
        let tempMsgs = state.msgs[sessionId]
        if (!tempMsgs || tempMsgs.length === 0) {
            return
        }
        let lastMsgIndex = tempMsgs.length - 1
        for (let i = lastMsgIndex; i >= 0; i--) {
            let currMsg = tempMsgs[i]
            if (id === currMsg.id) {
                state.msgs[sessionId].splice(i, 1)
                state.currSessionMsgs.splice(i, 1)
                break
            }
        }
    },
    // 替换消息列表消息，如消息撤回
    replaceMsg(state, obj) {
        let { sessionId, idClient, msg } = obj
        let tempMsgs = state.msgs[sessionId]
        if (!tempMsgs || tempMsgs.length === 0) {
            return
        }
        let lastMsgIndex = tempMsgs.length - 1
        for (let i = lastMsgIndex; i >= 0; i--) {
            let currMsg = tempMsgs[i]
            console.log(idClient, currMsg.idClient, currMsg.text)
            if (idClient === currMsg.idClient) {
                state.msgs[sessionId].splice(i, 1, msg)
                break
            }
        }
    },
    // 用idClient 更新消息，目前用于消息撤回
    updateMsgByIdClient(state, msgs) {
        if (!Array.isArray(msgs)) {
            msgs = [msgs]
        }
        let tempTime = (new Date()).getTime()
        msgs.forEach(msg => {
            // 有idClient 且 5分钟以内的消息
            if (msg.idClient && (tempTime - msg.time < 1000 * 300)) {
                state.msgsMap[msg.idClient] = msg
            }
        })
    },
    // 更新当前会话id，用于唯一判定是否在current session状态
    updateCurrSessionId(state, obj) {
        let type = obj.type || ''
        if (type === 'destroy') {
            state.currSessionId = null
        } else if (type === 'init') {
            if (obj.sessionId && (obj.sessionId !== state.currSessionId)) {
                state.currSessionId = obj.sessionId
            }
        }
    },
    // 更新当前会话列表的聊天记录，包括历史消息、单聊消息等，不包括聊天室消息
    // replace: 替换idClient的消息
    updateCurrSessionMsgs(state, obj) {
        let type = obj.type || ''
        if (type === 'destroy') { // 清空会话消息
            state.currSessionMsgs = []
            state.currSessionLastMsg = null
            store.commit('updateCurrSessionId', {
                type: 'destroy'
            })
        } else if (type === 'init') { // 初始化会话消息列表
            if (state.currSessionId) {
                let sessionId = state.currSessionId
                let currSessionMsgs = [].concat(state.msgs[sessionId] || [])
                // 做消息截断
                let limit = config.localMsglimit
                let msgLen = currSessionMsgs.length
                if (msgLen - limit > 0) {
                    state.currSessionLastMsg = currSessionMsgs[msgLen - limit]
                    currSessionMsgs = currSessionMsgs.slice(msgLen - limit, msgLen)
                } else if (msgLen > 0) {
                    state.currSessionLastMsg = currSessionMsgs[0]
                } else {
                    state.currSessionLastMsg = null
                }
                state.currSessionMsgs = []
                let lastMsgTime = 0
                currSessionMsgs.forEach(msg => {
                    if ((msg.time - lastMsgTime) > 1000 * 60 * 5) {
                        lastMsgTime = msg.time
                        state.currSessionMsgs.push({
                            type: 'timeTag',
                            text: util.formatDate(msg.time, false)
                        })
                    }
                    state.currSessionMsgs.push(msg)
                })
                // store.dispatch('checkTeamMsgReceipt', state.currSessionMsgs)
            }
        } else if (type === 'put') { // 追加一条消息
            let newMsg = obj.msg
            let lastMsgTime = 0
            let lenCurrMsgs = state.currSessionMsgs.length
            if (lenCurrMsgs > 0) {
                lastMsgTime = state.currSessionMsgs[lenCurrMsgs - 1].time
            }
            if (newMsg) {
                if ((newMsg.time - lastMsgTime) > 1000 * 60 * 5) {
                    state.currSessionMsgs.push({
                        type: 'timeTag',
                        text: util.formatDate(newMsg.time, false)
                    })
                }
                state.currSessionMsgs.push(newMsg)
                // store.dispatch('checkTeamMsgReceipt', [newMsg])
            }
        } else if (type === 'concat') {
            // 一般用于历史消息拼接
            let currSessionMsgs = []
            let lastMsgTime = 0
            obj.msgs.reverse()
            obj.msgs.forEach(msg => {
                if ((msg.time - lastMsgTime) > 1000 * 60 * 5) {
                    lastMsgTime = msg.time
                    currSessionMsgs.push({
                        type: 'timeTag',
                        text: util.formatDate(msg.time, false)
                    })
                }
                currSessionMsgs.push(msg)
            })
            currSessionMsgs.reverse()
            currSessionMsgs.forEach(msg => {
                state.currSessionMsgs.unshift(msg)
            })
            console.log(currSessionMsgs)
            if (obj.msgs[0]) {
                state.currSessionLastMsg = obj.msgs[0]
            }
            // store.dispatch('checkTeamMsgReceipt', currSessionMsgs)
        } else if (type === 'replace') {
            let msgLen = state.currSessionMsgs.length
            let lastMsgIndex = msgLen - 1
            if (msgLen > 0) {
                for (let i = lastMsgIndex; i >= 0; i--) {
                    if (state.currSessionMsgs[i].idClient === obj.idClient) {
                        state.currSessionMsgs.splice(i, 1, obj.msg)
                        break
                    }
                }
            }
        }
    },
   
    setNoMoreHistoryMsgs(state) {
        state.noMoreHistoryMsgs = true
    },
    resetNoMoreHistoryMsgs(state) {
        state.noMoreHistoryMsgs = false
    },
}
