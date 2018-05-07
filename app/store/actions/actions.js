import { initNimSDK } from './initNimSDK'
import cookie from '../../utils/cookie'

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
    updateRefreshState({commit}){
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
    initNimSDK
}

export default indexActions