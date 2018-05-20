import store from '../'
import config from '../../config/nim.config.js'
import {getDataByIndex} from './indexDBInit'
import util from '../../utils'

export function onRoamingMsgs (obj) {
  // let msgs = obj.msgs
  // store.commit('updateMsgs', msgs)
  // store.dispatch('saveData', {obj:msgs,table:'Msgs'})
}

export function onOfflineMsgs (obj) {
  let msgs = obj.msgs
  
  updateUserInfo(msgs)
  store.commit('updateMsgs', msgs)
  store.dispatch('saveData', {obj:msgs,table:'Msgs'})
}

function updateUserInfo(msgs){
  let users = []
  msgs.map(msg => {
    if(msg.flow === 'in'){
      let msgBody = JSON.parse(msg.content).data
      users.push({
        id:msgBody.fromUserID,
        userName:msgBody.fromUserName,
        userAccid:msgBody.fromUserChatID,
        userAvatar:msgBody.fromUserAvatarUrl,
        userType:msgBody.fromUserType
      })
    }
  })
  store.dispatch('updateUserInfor',users)
}

export function onMsg (msg) {
  console.log(msg,'msg')
  store.commit('putMsg', msg)
  if (msg.sessionId === store.state.currSessionId) {
    store.commit('updateCurrSessionMsgs', {
      type: 'put',
      msg
    })
    // 发送已读回执
    store.dispatch('sendMsgReceipt')
  }
  // if (msg.scene === 'team' && msg.type ==='notification') {
  //   store.dispatch('onTeamNotificationMsg', msg)
  // }
  // let currentSession = store.state.sessionMap[store.state.currSessionId]
  // currentSession.lastMsg = msg
  // store.dispatch('updateData', {obj:currentSession,table:'Sessions'})
  // store.commit('updateSessions',[currentSession])
  updateUserInfo([msg])
  store.dispatch('saveData', {obj:msg,table:'Msgs'})
}

function onSendMsgDone (error, msg) {
  store.dispatch('hideLoading')
  if (error) {
    // 被拉黑
    if (error.code === 7101) {
      msg.status = 'success'
      alert(error.message)
    } else {
      alert(error.message)
    }
  }
  onMsg(msg)
}

// 消息撤回
export function onRevocateMsg (error, msg) {
  const nim = store.state.nim
  if (error) {
    if (error.code === 508) {
      alert('发送时间超过2分钟的消息，不能被撤回')
    } else {
      alert(error)
    }
    return
  }
  let tip = ''
  if (msg.from === store.state.userUID) {
    tip = '你撤回了一条消息'
  } else {
    let userInfo = store.state.userInfos[msg.from]
    if (userInfo) {
      tip = `${util.getFriendAlias(userInfo)}撤回了一条消息`
    } else {
      tip = '对方撤回了一条消息'
    }
  }
  nim.sendTipMsg({
    isLocal: true,
    scene: msg.scene,
    to: msg.to,
    tip,
    time: msg.time,
    done: function sendTipMsgDone (error, tipMsg) {
      let idClient = msg.deletedIdClient || msg.idClient
      store.commit('replaceMsg', {
        sessionId: msg.sessionId,
        idClient,
        msg: tipMsg
      })
      if (msg.sessionId === store.state.currSessionId) {
        store.commit('updateCurrSessionMsgs', {
          type: 'replace',
          idClient,
          msg: tipMsg
        })
      }
    }
  })
}


export function revocateMsg ({state, commit}, msg) {
  const nim = state.nim
  let {idClient} = msg
  msg = Object.assign(msg, state.msgsMap[idClient])
  nim.deleteMsg({
    msg,
    done: function deleteMsgDone (error) {
      onRevocateMsg(error, msg)
    }
  })
}

// 发送普通消息
export function sendMsg ({state, commit}, obj) {
  const nim = state.nim
  obj = obj || {}
  let type = obj.type || ''
  store.dispatch('showLoading')
  switch (type) {
    case 'text':
      nim.sendText({
        scene: obj.scene,
        to: obj.to,
        text: obj.text,
        done: onSendMsgDone,
        needMsgReceipt: obj.needMsgReceipt || false
      })
      break
    case 'custom':
      nim.sendCustomMsg({
        scene: obj.scene,
        to: obj.to,
        pushContent: obj.pushContent,
        content: JSON.stringify(obj.content),
        data:obj.data,
        done: onSendMsgDone
      })
  }
}

// 发送消息已读回执
export function sendMsgReceipt ({state, commit}) {
  // 如果有当前会话
  let currSessionId = store.state.currSessionId
  if (currSessionId) {
    // 只有点对点消息才发已读回执
    if (util.parseSession(currSessionId).scene === 'p2p') {
      let msgs = store.state.currSessionMsgs
      const nim = state.nim
      if (state.sessionMap[currSessionId]) {
        nim.sendMsgReceipt({
          msg: state.sessionMap[currSessionId].lastMsg,
          done: function sendMsgReceiptDone (error, obj) {
            // do something
          }
        })
      }
    }
  }
}

function sendMsgReceiptDone(error, obj) {
    console.log('发送消息已读回执' + (!error?'成功':'失败'), error, obj);
}

export function getLocalHistoryMsgs({state, commit},id){
  store.dispatch('updateChatLoading', true)
  getDataByIndex((data)=>{
    console.log(data)
    if (data) {
      if (data.length === 0) {
        commit('setNoMoreHistoryMsgs')
      } else {
        let msgs = data
        commit('updateCurrSessionMsgs', {
          type: 'concat',
          msgs: msgs
        })
      }
    }
    store.dispatch('updateChatLoading', false)
  },'Msgs',id)
}

export function resetNoMoreHistoryMsgs ({commit}) {
  commit('resetNoMoreHistoryMsgs')
}
