export default {
    nim:null,
    loadingStatus: false,
    userInfor:{},
    // 好友/黑名单/陌生人名片, 数据结构如：{cid: {attr: ...}, ...}
    userInfos: {},
    // 消息列表
    msgs: {}, // 以sessionId作为key
    msgsMap: {}, // 以idClient作为key，诸如消息撤回等的消息查找
    // 会话列表
    sessionlist: [],
    sessionMap: {}
}