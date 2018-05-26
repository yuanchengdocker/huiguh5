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
    currMsgAudioId:null,
    currDoctorBind:false,//是否与该医生绑定
    showMenuBar: true,
    route: {},
    canUpdateConnectStatus:false,
    connectStatus:1, //1未连接，2收取中，0收取完,咨询医生,3重连中，4未登录
    // 全屏显示的原图
    isFullscreenImgShow: false,
    isFullscreenVideoShow: false,
    fullscreenImgSrc: '',
    fullscreenVideo: {},
    // 是否有更多历史消息，用于上拉加载更多
    noMoreHistoryMsgs: false,
    //上拉加载聊天时候显示
    isChatLoading:false,
    //聊天未读数量
    sessionUnreadCount:0,

    showToastMsg:'',
    msgTypeMap:{
        1: 'text',
        2: 'audio',
        3: 'image',
        4: 'tip',
        5: 'share',
        11: 'video',
        12: 'file',
        14: 'article',
        15: 'question'
    }
}