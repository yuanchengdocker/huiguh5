export default {
    nim: null,
    loadingStatus: false,
    userInfor: {},
    // 好友/黑名单/陌生人名片, 数据结构如：{cid: {attr: ...}, ...}
    userInfos: {},
    // 登录账户ID
    userUID: null,
    // 用户名片
    myInfo: {},
    // 消息列表
    msgs: {}, // 以sessionId作为key
    msgsMap: {}, // 以idClient作为key，诸如消息撤回等的消息查找
    msgLastTime:0,
    currSessionLastMsg:null,
    // 会话列表
    sessionlist: [],
    sessionMap: {},
    currSessionId: null,
    currSessionMsgs: [],
    showMenuBar: true,
    route: {},

    // 全屏显示的原图
    isFullscreenImgShow: false,
    fullscreenImgSrc: '',
    // 是否有更多历史消息，用于上拉加载更多
    noMoreHistoryMsgs: false,
    //上拉加载聊天时候显示
    isChatLoading:false,
    //聊天未读数量
    sessionUnreadCount:0
}