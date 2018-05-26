/*
 * 会话列表
 */

import store from '../'
import util from '../../utils'

export function setCurrSession ({state, commit, dispatch}, sessionId) {
    const nim = state.nim
    if (sessionId) {
      commit('updateCurrSessionId', {
        type: 'init',
        sessionId
      })
      if (nim) {
        // 如果在聊天页面刷新，此时还没有nim实例，需要在onSessions里同步
        nim.setCurrSession(sessionId)
        commit('resetNoMoreHistoryMsgs')
        commit('updateCurrSessionMsgs', {
          type: 'init',
          sessionId
        })
      }
    }
  }
  
  export function resetCurrSession ({state, commit}) {
    const nim = state.nim
    nim.resetCurrSession()
    commit('updateCurrSessionMsgs', {
      type: 'destroy'
    })
  }

// onSessions只在初始化完成后回调
export function onSessions (sessions) {
  checkUpdateSession(sessions)
}

function getUserInfo(session){
  if(!session) session = {}
  return {
      id:session.id,
      lastMsg: util.parseMsgToSelfDefined(session.lastMsg),
      scene:session.scene,
      to:session.to,
      unread:session.unread,
      updateTime:session.updateTime
  }
}

function checkUpdateSession(sessions){
  if(!sessions || (!Array.isArray(sessions) && !sessions.id)) return
  if(!Array.isArray(sessions)) sessions = [sessions]
  sessions = sessions.filter((session)=>{
    if(session && session.scene === 'p2p'){
      return true
    }
    return false
  })
  let update = false
  for(let i=0;i<sessions.length;i++){
    let session = sessions[i]
    let id = session.id
    if(!util.objCmp(getUserInfo(store.state.sessionMap[id]),getUserInfo(session))){
        update = true
        break
    }
  }

  if(!update) return
  console.log('sessions不同')

  store.commit('updateSessions', sessions)
  store.dispatch('saveData', {obj:sessions,table:'Sessions'})
}

export function onUpdateSession (session) {
  let sessions = [session]
  checkUpdateSession(sessions)
}


export function deleteSession ({state, commit}, sessionId) {
  const nim = state.nim
  sessionId = sessionId || ''
  let scene = null
  let account = null
  if (/^p2p-/.test(sessionId)) {
    scene = 'p2p'
    account = sessionId.replace(/^p2p-/, '')
  } else if (/^team-/.test(sessionId)) {
    scene = 'team'
    account = sessionId.replace(/^team-/, '')
  }
  if (account && scene) {
    nim.deleteSession({
      scene,
      to: account,
      done: function deleteServerSessionDone (error, obj) {
        if (error) {
          alert(error)
          return
        }
        nim.deleteLocalSession({
          id: sessionId,
          done: function deleteLocalSessionDone (error, obj) {
            if (error) {
              alert(error)
              return
            }
            commit('deleteSessions', [sessionId])
          }
        })
      }
    })
  }
}

