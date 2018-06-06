import Vue from 'vue'
import store from '../store'

if (!Function.prototype.bind) {
  Function.prototype.bind = function () {
    var fn = this, args = Array.prototype.slice.call(arguments), object = args.shift();
    return function () {
      return fn.apply(object, args.concat(Array.prototype.slice.call(arguments)));
    }
  }
}

let Utils = Object.create(null)

Utils.judgeAndroidOrIos = function () {
  var UA = window.navigator.userAgent;
  if (/Android|HTC/i.test(UA) || !!(window.navigator['platform'] + '').match(/Linux/i)) UA = 'Android';
  else if (/iPad/i.test(UA) || /iPod|iPhone/i.test(UA)) UA = 'iOS';
  else UA = 'other';
  return UA
}

Utils.MsgsUpdateOrDelete = function (msgs, msg, isDelete) {
  let result = []
  if (isDelete) {
    msgs && msgs.filter((item, index) => {
      if (item.id !== msg.id) {
        result.push(item)
      } else {
        if (result && result[result.length - 1]
          && result[result.length - 1].type === 'timeTag') {
          if (!msgs[index + 1] || (msgs[index + 1] && msgs[index + 1].type === 'timeTag')) {
            result.pop()
          }
        }
      }
    })
  } else {
    msgs = msgs && msgs.map((item) => {
      if (item.id === msg.id) {
        result.push(msg)
      } else {
        result.push(item)
      }
    })
  }
  return result
}

Utils.buildSelfDefinedMsg = function (content, status = 'sending') {
  let state = store.state
  let userInfos = state.userInfos
  let myInfo = state.myInfo
  let toInfo = userInfos[this.parseSession(state.currSessionId).to]
  let msg = {}
  msg['flow'] = 'out'
  msg['scene'] = 'p2p'
  msg['status'] = status
  msg['time'] = (new Date()).getTime()

  msg['id'] = this.getUuid(), //，只生成uid
    msg['chatType'] = 1
  msg['fromUserAccid'] = myInfo.userAccid
  msg['fromUserGender'] = myInfo.fromUserGender || 0
  msg['fromUserID'] = myInfo.id
  msg['fromUserName'] = myInfo.userName
  msg['fromUserAvatarUrl'] = myInfo.userAvatar
  msg['fromUserType'] = 2
  msg['remark'] = ''
  msg['hasRead'] = false
  msg['toUserId'] = toInfo.id
  msg['toUserAccid'] = toInfo.userAccid
  msg['toUserName'] = toInfo.userName
  msg['sessionType'] = 1
  msg['sessionId'] = state.currSessionId
  //实时消息
  msg['messageContentType'] = content.messageContentType
  msg['textContent'] = content.textContent
  msg['mediaContent'] = content.mediaContent

  return msg
}
Utils.parseMsgToSelfDefined = function (msg) {
  return msg ? {
    content: msg.content,
    flow: msg.flow,
    from: msg.from,
    idClient: msg.idClient,
    scene: msg.scene,
    to: msg.to,
    type: msg.type,
    time: msg.time,
    status: msg.status,
    sessionId: msg.sessionId
  } : {}
}

Utils.toNimMsg = function (msg) {
  let data = getContentParams(msg)
  data['fromUserChatID'] = msg.fromUserAccid
  data['sessionHKID'] = msg.toUserId
  data['sessionID'] = msg.toUserAccid
  data['sessionName'] = msg.toUserName
  data['sendPlatform '] = ''
  data['messageID'] = ''
  data['mediaContent'] = (typeof msg.mediaContent !== 'string') ? JSON.stringify(msg.mediaContent) : msg.mediaContent
  let obj = {
    scene: msg.scene,
    to: msg.toUserAccid,
    content: {
      type: 1,
      data: data
    }
  }
  return obj
}
Utils.toMyMsg = function (msg) {
  if (!msg) return {}
  let result = {
    scene: msg.scene,
    flow: msg.flow,
    status: msg.status,
    sessionId: msg.sessionId,
    time: msg.time //消息发送时间
  }
  let content = msg.content ? JSON.parse(msg.content) : {}
  if (!content.data) return result
  let data = content.data
  getContentParams(data, result)
  result['fromUserAccid'] = data.fromUserChatID
  result['toUserId'] = data.sessionHKID
  result['toUserAccid'] = data.sessionID
  result['toUserName'] = data.sessionName
  result['hasRead'] = false
  return result
}
function getContentParams(data, result = {}) {
  result['id'] = data.id || Utils.getUuid(), //若为外来消息，只生成uid
    result['chatType'] = data.chatType
  result['fromUserGender'] = data.fromUserGender
  result['fromUserID'] = data.fromUserID
  result['fromUserName'] = data.fromUserName
  result['fromUserAvatarUrl'] = data.fromUserAvatarUrl
  result['fromUserType'] = data.fromUserType
  result['remark'] = data.remark
  result['hasRead'] = data.hasRead
  result['sessionType'] = data.sessionType
  result['messageContentType'] = data.messageContentType
  result['textContent'] = data.textContent
  result['mediaContent'] = data.mediaContent && typeof data.mediaContent === 'string' ? JSON.parse(data.mediaContent) : data.mediaContent
  return result
}


Utils.parseMediaContent = function (msg) {
  let data = JSON.parse(msg.content)
  let content = data.data
  let mediaContent = content.mediaContent || {}
  if (mediaContent && typeof mediaContent === 'string') {
    mediaContent = JSON.parse(mediaContent)
  }
  return mediaContent
}

Utils.stringMediaContentMsg = function (mediaContent, msg) {
  let data = JSON.parse(msg.content)
  let content = data.data
  content.mediaContent = mediaContent
  msg.content = JSON.stringify(data)
}

Utils.getMsgType = function (msg) {
  let msgTypeMap = store.state.msgTypeMap
  return msgTypeMap[msg.messageContentType || 1]
}

Utils.getUuid = function () {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = (new Date).getTime() + '-' + s.join("");
  return uuid;
}

Utils.encode = function (_map, _content) {
  _content = '' + _content
  if (!_map || !_content) {
    return _content || ''
  }
  return _content.replace(_map.r, function ($1) {
    var _result = _map[!_map.i ? $1.toLowerCase() : $1]
    return _result != null ? _result : $1
  });
};

Utils.escape = (function () {
  let _reg = /<br\/?>$/
  let _map = {
    r: /\<|\>|\&|\r|\n|\s|\'|\"/g,
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    ' ': '&nbsp;',
    '"': '&quot;',
    "'": '&#39;',
    '\n': '<br/>',
    '\r': ''
  }
  return function (_content) {
    _content = Utils.encode(_map, _content)
    return _content.replace(_reg, '<br/>');
  };
})();

Utils.object2query = function (obj) {
  let keys = Object.keys(obj)
  let queryArray = keys.map(item => {
    return `${item}=${encodeURIComponent(obj[item])}`
  })
  return queryArray.join('&')
}

// https://cn.vuejs.org/v2/guide/reactivity.html
// Vue 不能检测到对象属性的添加或删除。然而它可以使用 Vue.set(object, key, value) 方法将响应属性添加到嵌套的对象上
Utils.mergeObject = function (dest, src) {
  if (typeof dest !== 'object' || dest === null) {
    dest = Object.create(null)
  }
  dest = Object.assign(Object.create(null), dest, src)
  return dest
}

Utils.updateChatUserName = function (title) {
  document.title = title;
  var i = document.createElement('iframe');
  // i.src = '/favicon.ico';
  i.style.display = 'none';
  i.onload = function () {
    setTimeout(function () {
      i.remove();
    }, 9)
  }
  document.body.appendChild(i);
}

Utils.mergeVueObject = function (dest, src) {
  let keys = Object.keys(src)
  keys.forEach(item => {
    if (typeof src[item] !== 'undefined') {
      Vue.set(dest, item, src[item])
    }
  })
  return dest
}
// 消息类型列表
Utils.mapMsgType = function (msg) {
  let map = {
    text: '文本消息',
    image: '图片消息',
    file: '文件消息',
    audio: '语音消息',
    video: '视频消息',
    geo: '地理位置消息',
    tip: '提醒消息',
    custom: '自定义消息',
    notification: '系统通知',
    robot: '机器人消息',
    share: '分享内容',
    article: '患教资料',
    question: '问卷调查'
  }
  let type = msg.type
  return map[type] || '未知消息类型'
}

Utils.getVideoTime = function (time) {
  if (typeof time === 'string') {
    time = parseInt(time)
  }
  if (time >= 60) {
    let minuts = parseInt(time / 60)
    let second = time - minuts * 60
    return minuts + ':' + (second < 10 ? ('0' + second) : second)
  } else {
    return '0:' + (time < 10 ? ('0' + time) : time)
  }
}

Utils.stringifyDate = function (datetime, simple = false) {
  // let weekMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  let weekMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  datetime = new Date(datetime)
  let year = datetime.getFullYear()
  let simpleYear = datetime.getYear() - 100
  let month = datetime.getMonth() + 1
  month = month > 9 ? month : '0' + month
  let day = datetime.getDate()
  day = day > 9 ? day : '0' + day
  let hour = datetime.getHours()
  hour = hour > 9 ? hour : '0' + hour
  let min = datetime.getMinutes()
  min = min > 9 ? min : '0' + min
  let week = datetime.getDay()
  week = weekMap[week]
  let thatDay = (new Date(year, month - 1, day, 0, 0, 0)).getTime()

  if (simple) {
    return {
      withYear: `${day}/${month}/${simpleYear}`,
      withMonth: `${month}-${day}`,
      withDay: `${week}`,
      withLastDay: `昨天`,
      withHour: `${hour}:${min}`,
      thatDay
    }
  } else {
    return {
      withYear: `${year}-${month}-${day} ${hour}:${min}`,
      withMonth: `${month}-${day} ${hour}:${min}`,
      withDay: `${week} ${hour}:${min}`,
      withLastDay: `昨天 ${hour}:${min}`,
      withHour: `${hour}:${min}`,
      thatDay
    }
  }
}

/* 格式化日期 */
Utils.formatDate = function (datetime, simple = false) {
  let tempDate = (new Date()).getTime()
  let result = this.stringifyDate(datetime, simple)
  let thatDay = result.thatDay
  let deltaTime = (tempDate - thatDay) / 1000

  if (deltaTime < 3600 * 24) {
    return result.withHour
  } else if (deltaTime < 3600 * 24 * 2) {
    return result.withLastDay
  } else if (deltaTime < 3600 * 24 * 7) {
    return result.withMonth
  } else if (deltaTime < 3600 * 24 * 30) {
    return result.withMonth
  } else {
    return result.withYear
  }
}

Utils.parseSession = function (sessionId) {
  if (/^p2p-/.test(sessionId)) {
    return {
      scene: 'p2p',
      to: sessionId.replace(/^p2p-/, '')
    }
  } else if (/^team-/.test(sessionId)) {
    return {
      scene: 'team',
      to: sessionId.replace(/^team-/, '')
    }
  }
}

Utils.parseCustomMsg = function (msg) {
  if (msg.type === 'custom') {
    try {
      let cnt = JSON.parse(msg.content)
      switch (cnt.type) {
        case 1:
          return '[猜拳消息]'
        case 2:
          return '[阅后即焚]'
        case 3:
          return '[贴图表情]'
        case 4:
          return '[白板消息]'
      }
    } catch (e) { }
    return '[自定义消息]'
  }
  return ''
}
/* 获得有效的备注名 */
Utils.getFriendAlias = function (userInfo) {
  userInfo.alias = userInfo.alias ? userInfo.alias.trim() : ''
  return userInfo.alias || userInfo.nick || userInfo.account
}

Utils.generateTeamSysmMsg = function (data) {
  var text, nicks = this.getNickNames(data.attach.users)
  switch (data.attach.type) {
    case 'updateTeam':
      text = this.getTeamUpdateInfo(data)
      break;
    case 'addTeamMembers': {
      let op = nicks.pop()
      text = `${op}邀请${nicks.join()}加入群`
      break;
    }
    case 'removeTeamMembers': {
      let op = nicks.pop()
      text = `${nicks.join()}被${op}移出群`
      break;
    }
    case 'acceptTeamInvite': {
      let op = nicks.pop()
      text = `${nicks.join()}接受了${op}入群邀请`
      break;
    }
    case 'passTeamApply': {
      let op = nicks.shift()
      if (nicks.length === 1 && op === nicks[0]) {
        // 此情况为高级群设置不需要验证，用户申请入群后，收到的群消息提示
        text = `${op}加入群`
      } else {
        text = `${op}通过了${nicks}入群邀请`
      }
      break;
    }
    case 'addTeamManagers': {
      // todo test
      let op = nicks.pop()
      text = `${op}新增了${nicks}为管理员`
      break;
    }
    case 'removeTeamManagers': {
      // todo test
      let op = nicks.pop()
      text = `${op}移除了${nicks}的管理员权限`
      break;
    }
    case 'leaveTeam': {
      text = `${nicks.join()}退出了群`
      break;
    }
    case 'dismissTeam': {
      text = `${nicks.join()}解散了群`
      break;
    }
    case 'transferTeam': {
      // todo test
      let nicks = this.getNickNames(data.attach.users)
      let op = nicks.shift()
      text = `${op}转让群主给${nicks}`
      break;
    }
    case 'updateTeamMute': {
      let nicks = this.getNickNames(data.attach.users)
      let op = nicks.shift()
      text = `${nicks}被管理员${data.attach.mute ? '禁言' : '解除禁言'}`
      break;
    }
    default:
      break;
  }
  return text
}

// todo 写成私有成员方法
Utils.getNickNames = function (users) {
  return users.map(user => {
    return user.account === store.state.userUID ? '你' : user.nick
  })
}

// todo 写成私有成员方法
Utils.getTeamUpdateInfo = function (msg) {
  let text, team = msg.attach.team, op = this.getNickNames(msg.attach.users).pop()
  if (team['name']) {
    text = `${op}修改群名为${team['name']}`
  } else if (team['intro']) {
    text = `${op}修改群介绍为${team['intro']}`
  }
  // 由于群公告的交互与 Android iOS 不一致，现版本不适配群公告
  // else if (team['announcement']) {
  //   text = `${op}修改群公告为${team['announcement']}`
  // } 
  else if (team['joinMode']) {
    text = `群身份验证模式更新为${team.joinMode === 'noVerify' ? '不需要验证' : team.joinMode === 'needVerify' ? '需要验证' : '禁止任何人加入'}`
  } else if (team['inviteMode']) {
    text = `邀请他人权限为${team['inviteMode'] === 'all' ? '所有人' : '管理员'}`
  } else if (team['updateTeamMode']) {
    text = `群资料修改权限为${team['updateTeamMode'] === 'all' ? '所有人' : '管理员'}`
  } else if (team['beInviteMode']) {
    text = `被邀请人身份${team['beInviteMode'] === 'noVerify' ? '不需要验证' : '需要验证'}`
  } else {
    text = '更新群信息'
  }
  return text
}

Utils.teamConfigMap = {
  joinMode: {
    'noVerify': '不需要验证',
    'needVerify': '需要验证',
    'rejectAll': '禁止任何人加入'
  },
  beInviteMode: {
    'needVerify': '需要验证',
    'noVerify': '不需要验证'
  },
  inviteMode: {
    'manager': '管理员邀请',
    'all': '所有人邀请'
  },
  updateTeamMode: {
    'manager': '管理员修改',
    'all': '所有人修改'
  },
  memberType: {
    'manager': '管理员',
    'normal': '普通成员'
  }
}

Utils.objCmp = function (x, y) {
  if (x === y) {
    return true;
  }
  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false;
  }
  if (x.constructor !== y.constructor) {
    return false;
  }
  for (var p in x) {
    if (x.hasOwnProperty(p)) {
      if (!y.hasOwnProperty(p)) {
        return false;
      }
      if (x[p] === y[p]) {
        continue;
      }
      if (typeof (x[p]) !== "object") {
        return false;
      }
      if (!this.objCmp(x[p], y[p])) {
        return false;
      }
    }
  }
  for (p in y) {
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
      return false;
    }
  }
  return true;
}

export default Utils
