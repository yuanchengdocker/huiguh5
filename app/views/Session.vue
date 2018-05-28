<template>
    <div class="g-inherit m-main p-session">
        <div class="session-wrapper" ref="sessionWrapper" v-if="sessionlist&&sessionlist.length>0">
            <group class="u-list session-container">
                <cell v-for="(session) in sessionlist" class="u-list-item" :title="session.name" :inline-desc="session.lastMsgShow" :key="session.id" :userName="session.name" :sessionId="session.id" v-touch:swipeleft="showDelBtn" v-touch:swiperight="hideDelBtn" @click.native="enterChat(session)">
                    <img class="icon u-circle" onerror='this.src="http://yx-web.nos.netease.com/webdoc/h5/im/default-icon.png"' slot="icon" width="24" :src="session.avatar">
                    <span class='u-session-time'>
                                {{session.updateTimeShow}}
                            </span>
                    <span v-show="session.unread > 0" class="u-unread">{{session.unread}}</span>
                    <span class="u-tag-del" :class="{active: delSessionId===session.id}" @click.stop="deleteSession"></span>
                </cell>
            </group>
        </div>
        <div v-else class="session-nochat">
            <section class="nochat-container">
                <img class="nochat-img" src="../img/nochat.png" alt=""/>
                <p class="nochat-title">暂无可咨询医生</p>
            </section>
        </div>
        <div v-show="false">{{sessionTitle}}</div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    import {
        mapState,
        mapActions
    } from 'vuex'
    import util from '../utils'
    import config from '../config/nim.config'
    import {
        setTimeout
    } from 'timers';
    export default {
        name: 'session',
        components: {},
        beforeRouteEnter: (to, from, next) => {
            next((v)=>{
                util.updateChatUserName(v.sessionTitle)
            })
        },
        data() {
            return {
                delSessionId: null,
                delUserName:null,
                stopBubble: false,
                isClick: false,
                isDelClick:false
            }
        },
        created(){
        },
        mounted() {
            if (this.$refs.sessionWrapper) {
                this.initScroll()
            }
        },
        updated() {
            if (this.$refs.sessionWrapper) {
                this.initScroll()
            }
        },
        computed: {
            userInfos() {
                return this.$store.state.userInfos
            },
            myPhoneId() {
                return this.$store.state.userUID
            },
            sessionTitle(){
                let result = '';
                switch(this.$store.state.connectStatus){
                    case 0: result = '咨询医生' ;break;
                    case 1: result = '咨询医生（未连接）' ;break;
                    case 2: result = '收取中...' ;break;
                    case 3: result = '重连接中...' ;break;
                    case 4: result = '未登录' ;break;
                }
                if(this.$route.path === '/build/vuepage/session'){
                    util.updateChatUserName(result)
                }
                return result;
            },
            sessionlist() {
                let sessionlist = this.$store.state.sessionlist.map(sitem => {
                    let item = Object.assign({}, sitem)
                    item.name = ''
                    item.avatar = ''
                    if (item.scene === 'p2p') {
                        let userInfo = null
                        if (item.to !== this.myPhoneId) {
                            userInfo = this.userInfos[item.to]
                        } else {
                            userInfo = this.userInfos[this.myPhoneId]
                            userInfo.alias = '我的手机'
                            userInfo.avatar = `${config.myPhoneIcon}`
                            return false
                        }
                        if (userInfo) {
                            item.name = userInfo.userName
                            item.avatar = userInfo.userAvatar||'http://yx-web.nos.netease.com/webdoc/h5/im/default-icon.png'
                        }
                    } else if (item.scene === 'team') {
                        return false
                    }

                    let lastMsg = item.lastMsg || {}

                    switch(lastMsg.messageContentType){
                        case 1: item.lastMsgShow = lastMsg.textContent || '';lastMsg['type']='text'; break; //文本
                        case 2: lastMsg['type']='audio'; break; //语音
                        case 3: lastMsg['type']='image'; break; //图片
                        case 4: lastMsg['type']='tip'; break; //提示内容
                        case 5: lastMsg['type']='share'; break; //分享内容
                        case 11: lastMsg['type']='video'; break; //视频
                        case 12: lastMsg['type']='file'; break; //文件
                        case 14: lastMsg['type']='article'; break; //患教资料
                        case 15: lastMsg['type']='question'; break; //问卷
                    }

                    if (lastMsg['type'] != 'text' && util.mapMsgType(lastMsg)) {
                        item.lastMsgShow = `[${util.mapMsgType(lastMsg)}]`
                    } 
                    if (item.updateTime) {
                        item.updateTimeShow = util.formatDate(item.updateTime, true)
                    }
                    return item
                })
                return sessionlist
            }
        },
        methods: {
            ...mapActions(['updatedLoadingStatus']),
            enterChat(session) {
                if (!this.isClick) {
                    setTimeout(() => {
                        this.isClick = false
                        if (this.hideDelBtn())
                            return
                        if (session && session.id)
                            this.$router.push(`/build/vuepage/chat/${session.id}`);
                    }, 20)
                }
                this.isClick = true
            },
            deleteSession(e) {
                if(!this.isDelClick){
                    let _this = this
                    setTimeout(() => {
                        this.isDelClick = false
                        if (this.delSessionId !== null) {
                            this.$vux.confirm.show({
                                title: `确定要删除与${_this.delUserName}的对话吗？`,
                                onConfirm () {
                                    _this.$store.dispatch('deleteOneData', {id:_this.delSessionId,table:'Sessions',callback:()=>{
                                        _this.$store.dispatch('deleteSessions', {sessionId:_this.delSessionId})
                                        _this.delSessionId = null
                                        _this.delUserName = null
                                    }})
                                }
                            })
                        }
                    },20)
                }
                this.isDelClick = true
            },
            showDelBtn(vNode) {
                if (vNode && vNode.data && vNode.data.attrs) {
                    this.delSessionId = vNode.data.attrs.sessionId
                    this.delUserName = vNode.data.attrs.userName
                    this.stopBubble = true
                    setTimeout(() => {
                        this.stopBubble = false
                    }, 20)
                }
            },
            hideDelBtn() {
                if (this.delSessionId !== null && !this.stopBubble) {
                    // 用于判断是否前置状态是显示删除按钮
                    this.delSessionId = null
                    this.delUserName = null
                    return true
                }
                return false
            },
            initScroll() {
                this.scroll = new BScroll(this.$refs.sessionWrapper, {
                    // probeType: 3,    
                    scrollY: true,
                    click: true,
                    mouseWheel: { // pc端同样能滑动
                        speed: 20,
                        invert: false
                    },
                    useTransition: true, // 防止iphone微信滑动卡顿
                });
               
            },
        }
    }
</script>

<style type="text/css" scoped>
    .session-nochat{
        height: 80%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    .session-nochat .nochat-img{
        width: 40px
    }
    .session-nochat .nochat-title{
        font-size: 16px;
        color: #c0c6d0;
    }
    .vux-cell-primary {
        max-width: 70%;
    }
    .vux-x-icon {
        fill: #F70968;
    }
    .g-window .weui-cell::before {
        height: 1px;
    }
    .session-wrapper {
        height: 100%;
        overflow: hidden;
    }
    .session-container {
        height: 101%;
    }
</style>
<style lang="less" scoped>
    @button-global-height: 100px;
</style>

