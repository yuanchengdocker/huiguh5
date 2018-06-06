import store from '../'
import config from '../../config/nim.config.js'
import {getDataByIndex,updateData} from './indexDBInit'
import util from '../../utils'
import axios from '../../service/service'
import cookie from './../../utils/cookie';
import { uploadFile } from './../../utils/qiniuSdk';

//离线接受消息，区分在聊天界面时候put消息，在列表界面只存储消息，更新回话
export function onOfflineMsgs (obj) {
  let msgs = obj.msgs
  let putMsg = []
  msgs = msgs&&msgs.map((msg)=>{
    msg = util.toMyMsg(msg)
    store.dispatch('onUpdateSession',msg)
    let sessionId = msg.sessionId
    if(store.state.msgs[sessionId]){
      putMsg.push(msg)
    }
    return msg
  })
  if(putMsg && putMsg.length > 0){
    store.commit('updateMsgs',putMsg)
  }
  updateUserInfo(msgs)
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
  try {
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
      if(util.getMsgType(msg) === 'image'){
        cookie.delLocal(msg.mediaContent.fileDataLocalPath)
        msg.mediaContent.fileDataLocalPath = ''
      }
      store.dispatch('updateMsg',msg)
    }
    
    store.dispatch('onUpdateSession',msg)
    
  } catch (error) {
    alert(JSON.stringify(error))
  }
  
}

function onSendMsgDone (error, msg) {
  store.dispatch('hideLoading')
  if (error) {
      msg = util.toMyMsg(msg)
      updateFailMsg(error,msg)
  }else{
    onMsg(msg)
  }
}

export function buildAndPutMsg({state, commit},{callback,content,status}){
  let msg = util.buildSelfDefinedMsg(content,status)
  store.commit('putMsg', msg)
  store.commit('updateCurrSessionMsgs', {
    type: 'put',
    msg
  })
  store.dispatch('saveData', {obj:msg,table:'Msgs'})
  store.dispatch('onUpdateSession',msg)
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
    let {data,code,error} = await axios('post', 'getWxMedia', {
      mediaId: serverId,
      type:1
    })
    if (data && data.detailUrl) {
      msg['mediaContent']['fileDataUrl'] = data.detailUrl
      dispatch('sendMsg',msg)
    } else {
      updateFailMsg(code,msg)
    }
  })(serverId,msg)
}

export function sendImgMsg({state, commit,dispatch},{file,msg}){
  (async (file,msg)=>{
    let dataFile = new FormData()
    let ext = file.type.split('image/')[1]
    dataFile.append('file', file, "file_"+Date.parse(new Date())+"."+ext)
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
    // let dataFile = new FormData()
    // dataFile.append('file', file,"file_"+Date.parse(new Date())+".mp4")
    // dataFile.append('fileType', 3)
    try {
      // let {data,code,error} = await axios('post', 'fileUpload', dataFile, {
      //   "Content-Type": 'mutipart/form-data'
      // })
      let {duration,cover,qiniuDownUrl} = await uploadFile(file)
      if (qiniuDownUrl) {
        msg['mediaContent']['fileDataUrl'] = qiniuDownUrl
        msg['mediaContent']['coverUrl'] = cover
        msg['mediaContent']['duration'] = parseInt(duration)
        dispatch('sendMsg',msg)
      } else {
        updateFailMsg(error,msg)
      }
    } catch (error) {
      updateFailMsg(error,msg)
    }
  })(file,msg)
}

export function updateFailMsg(error,msg){
  msg.status = 'fail'
  store.dispatch('updateMsg',msg)
  store.dispatch('loadToad','网络异常,稍后重试')
}
