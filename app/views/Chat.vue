<template>
    <div class="g-inherit m-article">
        <div class="m-chat-main">
            <div class="m-chat-list">
                <div class="chat-wrapper" ref="wrapper">
                    <chat-list type="session" :wxSdk="wxSdk" :msglist="msglist" :canLoadMore="canLoadMore" :userInfos="userInfos" :myInfo="myInfo"></chat-list>
                </div>
            </div>
            <chat-editor type="session" @isSendMsg="isSendMsg" :scene="scene" :wxSdk="wxSdk" :to="to"></chat-editor>
        </div>
    </div>
</template>

<script>
    import ChatEditor from './components/ChatEditor'
    import ChatList from './components/ChatList'
    import util from '../utils'
    import BScroll from 'better-scroll'
    import '../style/stylus/chat.styl'
    import '../style/stylus/public.styl'
    import wxSdk from '../utils/wxSdk'
    import {
        mapActions,
        mapState,
        mapGetters
    } from 'vuex'
    export default {
        name:'chat',
        components: {
            ChatEditor,
            ChatList
        },
        props: ['id'],
        beforeRouteEnter: (to, from, next) => {
            next((that)=>{
                let urlSessionId = to.params.sessionId
                if(from.path === '/' || from.path === '/build/vuepage/menu/session'){
                    //加载页面内容
                    that.$nextTick(function () {
                        wxSdk.wxInit(that.$store.state.wxSdkUrl).then((sdk)=>{
                            that.wxSdk = sdk
                        })
                    })
                    // 此时设置当前会话
                    that.$store.dispatch('getDataByIndex', {callback:(data)=>{
                        that.$store.dispatch('setCurrSession', urlSessionId)
                        that.$store.dispatch('checkHaveBindDoctor')
                        that.$store.commit('updateMsgs', data)
                    },table:'Msgs',id:urlSessionId})
                }
            })
        },
        deactivated(){
            //离开页面关闭语音播放
            this.$store.dispatch('updateCurrMsgAudioId','')
            //关闭图片预览
            this.$store.dispatch('hideFullscreenImg')
            //关闭视频播放
            this.$store.dispatch('hideFullscreenVideo')
        },
        created() {
        },
        // 进入该页面，文档被挂载
        mounted() {
            // try {
            //     this.$nextTick(function () {
            //         wxSdk.wxInit(this.$store.state.wxSdkUrl).then((sdk)=>{
            //             this.wxSdk = sdk
            //         })
            //     })
            //     // 此时设置当前会话
            //     this.$store.dispatch('getDataByIndex', {callback:(data)=>{
            //         this.$store.dispatch('setCurrSession', this.sessionId)
            //         this.$store.dispatch('checkHaveBindDoctor')
            //         this.$store.commit('updateMsgs', data)
            //     },table:'Msgs',id:this.sessionId})
                
            // } catch (error) {
            //     alert('运行异常')
            // }
        },
        updated() {
            debugger
            if (this.$refs.wrapper) {
                let eles = document.getElementById('chat-list').children
                if(this.chatMsgStatus !== 2){
                    this.initScroll()
                }
                if(this.pullDowning){
                    if(this.chatMsgStatus === 3){
                        this.scroll.scrollToElement(eles[eles.length - this.chatItemLength + 1 ])
                    }
                }else{
                    if(this.chatMsgStatus === 1){ //初始化
                        this.scroll.scrollToElement(eles[eles.length - 1])
                    } 
                }
                this.chatItemLength = eles.length
               
                this.pullDowning = false
            }
        },
        // 离开该页面，此时重置当前会话
        destroyed() {
            //离开页面关闭语音播放
            this.$store.dispatch('updateCurrMsgAudioId','')
            //关闭图片预览
            this.$store.dispatch('hideFullscreenImg')
            //关闭视频播放
            this.$store.dispatch('hideFullscreenVideo')
            this.$store.dispatch('resetCurrSession')
        },
        data() {
            return {
                leftBtnOptions: {
                    backText: ' ',
                    preventGoBack: true,
                },
                chatItemLength: 0,
                pullDowning:false,
                wxSdk:null,
            }
        },
        computed: {
            ...mapGetters({msglist:'msglist'}),
            chatMsgStatus(){
                return this.$store.state.chatMsgStatus
            },
            sessionId(){
                return this.$route.params.sessionId
            },
            scene() {
                return this.sessionId?util.parseSession(this.sessionId).scene:''
            },
            to() {
                return this.sessionId?util.parseSession(this.sessionId).to:''
            },
            myInfo() {
                return this.$store.state.myInfo
            },
            userInfos() {
                let session = this.$store.state.sessionMap[this.sessionId]
                if(session){
                    var currUser = this.$store.state.userInfos[session.to]
                }
                if(currUser){
                    util.updateChatUserName(currUser.userName)
                }
                return this.$store.state.userInfos
            },
            canLoadMore() {
                return !this.$store.state.noMoreHistoryMsgs
            }
        },
        methods: {
            isSendMsg(){
            },
            ...mapActions(['updatedLoadingStatus', 'getLocalSessionMsg']),
            initScroll() {
                if(!this.scroll){
                    this.scroll = new BScroll(this.$refs.wrapper, {
                        probeType: 3,    
                        scrollY: true,
                        click: true,
                        mouseWheel: { // pc端同样能滑动
                            speed: 20,
                            invert: false
                        },
                        useTransition: true, // 防止iphone微信滑动卡顿
                    });
                }else{
                    this.scroll.refresh();
                }
                this.scroll.on('scroll', (pos) => {
                    if (pos.y >= 60 && this.canLoadMore && !this.pullDowning) {
                        this.getHistoryMsgs()
                        this.pullDowning = true
                    }
                });
            },
            getHistoryMsgs() {
                this.$store.dispatch('getLocalHistoryMsgs',this.sessionId)
            },
        }
    }
</script>
<style scoped>
    .g-window .m-tab .m-tab-right {
        width: 80px;
        right: -16px;
    }
    .m-tab-right {
        display: flex;
        justify-content: flex-end;
        .icon-history,
        .icon-team {
            display: inline-block;
            margin-right: 1.28px;
            width: 27.2px;
            height: 27.2px;
            background: url(http://yx-web.nos.netease.com/webdoc/h5/im/icons.png);
            background-size: 320px;
            background-position: -92.8px -180.8px;
        }
        .icon-team {
            background-position: -126.4px -180.8px;
        }
    }
    .invalidHint {
        width: 100%;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background-color: bisque;
        color: burlywood;
    }
</style>
<style>
    .g-window .vux-header .m-tab-top {
        width: 80%;
        margin: 0 10%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>