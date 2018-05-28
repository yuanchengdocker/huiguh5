import store from '../'
import config from '../../config/nim.config.js'
import {getDataByIndex,updateData} from './indexDBInit'
import util from '../../utils'
import axios from '../../service/service'

export function onOfflineMsgs (obj) {
  let msgs = obj.msgs
  msgs&&msgs.map((msg)=>{
    return util.toMyMsg(msg)
  })
  updateUserInfo(msgs)
  store.commit('updateMsgs', msgs)
}

function updateUserInfo(msgs){
  let users = []
  msgs.map(msg => {
    if(msg.flow === 'in'){
      users.push({
        id:msg.fromUserID,
        userName:msg.fromUserName,
        userAccid:msg.fromUserAccid,
        userAvatar:msg.fromUserAvatarUrl,
        userType:msg.fromUserType
      })
    }
  })
  store.dispatch('updateUserInfor',users)
  store.dispatch('saveData', {obj:msgs,table:'Msgs'})
}

export function onMsg (msg) {
  msg = util.toMyMsg(msg)
  if(util.getMsgType(msg) === 'audio'){
    msg['hasRead'] = false
  }
  if(msg.flow === 'in'){
    store.commit('putMsg', msg)
    if (msg.sessionId === store.state.currSessionId) {
      store.commit('updateCurrSessionMsgs', {
        type: 'put',
        msg
      })
    }
    updateUserInfo([msg])
  }else{
    store.dispatch('updateMsg',msg)
  }

  let sessionId = 'p2p-'+(msg.flow==='in'?msg.fromUserAccid:msg.toUserAccid)
  let updateSession = {
    id: sessionId,
    lastMsg: msg,
    scene: msg.scene,
    to: msg.flow==='in'?msg.fromUserAccid:msg.toUserAccid,
    unread: sessionId===store.state.currSessionId ? 0 : 1,
    updateTime:msg.time
  }
  store.dispatch('onUpdateSession',updateSession)
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

export function buildAndPutMsg({state, commit},{callback,content,status}){
  let msg = util.buildSelfDefinedMsg(content,status)

  store.commit('putMsg', msg)
  store.commit('updateCurrSessionMsgs', {
    type: 'put',
    msg
  })
  store.dispatch('saveData', {obj:msg,table:'Msgs'})

  callback&&callback(msg)
  return msg
}

export function updateMsg({state,commit},msg){
  store.commit('updateCurrSessionMsgs',{
    type: 'update',
    msg
  })
  store.commit('replaceMsg',msg)
  store.dispatch('saveData', {obj:msg,table:'Msgs'})
}

// 发送普通消息
export function sendMsg ({state, commit}, msg) {
  const nim = state.nim
  let obj = util.toNimMsg(msg)
  
  //发送
  let mm = nim.sendCustomMsg({
    scene: obj.scene,
    to: obj.to,
    content: JSON.stringify(obj.content),
    done: onSendMsgDone
  })
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

export function sendAudioMsg({state, commit,dispatch},{serverId,msg}){
  (async (serverId,msg)=>{
    alert('haha'+serverId)
    let {data,code,error} = await axios('post', 'getWxMedia', {
      mediaId: serverId,
      type:1
    })
    alert('haha')
    if (data && data.detailUrl) {
      msg['mediaContent']['fileDataUrl'] = data.detailUrl
      alert(data.detailUrl)
      dispatch('sendMsg',msg)
    } else {
      updateFailMsg(code,msg)
    }
  })(serverId,msg)
}

export function sendImgMsg({state, commit,dispatch},{file,msg}){
  (async (file,msg)=>{
    let dataFile = new FormData()
    dataFile.append('file', file)
    dataFile.append('fileType', 1)
    try {
      let {data,code,error} = await axios('post', 'fileUpload', dataFile, {
        "Content-Type": 'mutipart/form-data'
      })
      if (data) {
        msg['mediaContent']['fileDataUrl'] = data.mediumImagePath
        msg['mediaContent']['originUrl'] = data.largeImagePath
        msg['mediaContent']['thumbnailUrl'] = data.smallImagePath
        dispatch('sendMsg',msg)
      } else {
        updateFailMsg(error,msg)
      }
    } catch (error) {
      updateFailMsg(error,msg)
    }
  })(file,msg)
}

export function sendVideoMsg({state, commit,dispatch},{file,msg}){
  (async (file,msg)=>{
    let dataFile = new FormData()
    dataFile.append('file', file)
    dataFile.append('fileType', 3)
    try {
      let {data,code,error} = await axios('post', 'fileUpload', dataFile, {
        "Content-Type": 'mutipart/form-data'
      })
      if (data) {
        msg['mediaContent']['fileDataUrl'] = data.audioPath
        msg['mediaContent']['coverUrl'] = data.smallImagePath
        msg['mediaContent']['duration'] = data.voiceDuration
        dispatch('sendMsg',msg)
      } else {
        updateFailMsg(error,msg)
      }
    } catch (error) {
      updateFailMsg(error,msg)
    }
  })(file,msg)
}

function updateFailMsg(error,msg){
  msg.status = 'fail'
  store.dispatch('updateMsg',msg)
  store.dispatch('loadToad','网络异常')
}
