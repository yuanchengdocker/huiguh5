<template>
    <div class="g-inherit m-article">
        <div class="m-chat-main">
            <div class="m-chat-list">
                <div class="chat-wrapper" ref="wrapper">
                    <chat-list type="session" :msglist="msglist" :canLoadMore="canLoadMore" :userInfos="userInfos" :myInfo="myInfo"></chat-list>
                </div>
            </div>
            <chat-editor type="session" @isSendMsg="isSendMsg" :scene="scene" :to="to"></chat-editor>
        </div>
    </div>
</template>

<script>
    import ChatEditor from './components/ChatEditor'
    import ChatList from './components/ChatList'
    import util from '../utils'
    import pageUtil from '../utils/page'
    import BScroll from 'better-scroll'
    import '../style/stylus/chat.styl'
    import '../style/stylus/public.styl'
    import {
        mapActions,
        mapState,
        mapGetters
    } from 'vuex'
    import {
        setTimeout
    } from 'timers';
    export default {
        components: {
            ChatEditor,
            ChatList
        },
        props: ['id'],
        
        created() {
            this.$store.dispatch('setCurrSession', this.sessionId)
            this.$store.dispatch('checkHaveBindDoctor')
            this.updateMenuBarShow(false)
        },
        // 进入该页面，文档被挂载
        mounted() {
            // 此时设置当前会话
            this.$store.dispatch('setCurrSession', this.sessionId)
            this.$store.dispatch('getDataByIndex', {callback:(data)=>{
                this.$store.commit('updateMsgs', data)
            },table:'Msgs',id:this.sessionId})
            
            this.gotoDown = true
        },
        updated() {
            if (this.$refs.wrapper) {
                let eles = document.getElementById('chat-list').children
                if(this.chatItemLength != eles.length){
                    this.initScroll()
                }
                if(!this.gotoDown&&this.canLoadMore){
                    this.scroll.scrollToElement(eles[eles.length - this.chatItemLength-1])
                }
                this.chatItemLength = eles.length
                if (this.gotoDown) {
                    this.scroll.scrollToElement(eles[this.chatItemLength - 1])
                }
                this.pullDowning = false
            }
        },
        // 离开该页面，此时重置当前会话
        destroyed() {
            this.$store.dispatch('resetCurrSession')
            this.updateMenuBarShow(true)
        },
        data() {
            return {
                leftBtnOptions: {
                    backText: ' ',
                    preventGoBack: true,
                },
                gotoDown: true,
                chatItemLength: 0,
                pullDowning:false
            }
        },
        computed: {
            ...mapGetters({msglist:'msglist'}),
            sessionId() {
                let sessionId = this.$route.params.sessionId
                return sessionId
            },
            scene() {
                return util.parseSession(this.sessionId).scene
            },
            to() {
                return util.parseSession(this.sessionId).to
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
                this.gotoDown = true
            },
            ...mapActions(['updatedLoadingStatus', 'updateMenuBarShow', 'getLocalSessionMsg']),
            onClickBack() {
                this.$router.push(`/build/vuepage/session`);
            },
            initScroll() {
                this.scroll = new BScroll(this.$refs.wrapper, {
                    // probeType: 3,    
                    scrollY: true,
                    click: true,
                    // pullUpLoad: {   // 配置上啦加载
                    //   threshold: -80   //上啦80px的时候加载
                    // },
                    openPullDown: true,
                    pullDownRefresh: {
                        threshold: 50,
                        stop: 20
                    },
                    mouseWheel: { // pc端同样能滑动
                        speed: 20,
                        invert: false
                    },
                    useTransition: true, // 防止iphone微信滑动卡顿
                });
                this.scroll.on('pullingDown', (pos) => {
                    // 判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
                    if(!this.pullDowning){
                        console.log(pos)
                        this.getHistoryMsgs()
                        this.pullDowning = true
                        this.gotoDown = false
                        this.scroll.closePullUp()
                    }
                });
            },
            getHistoryMsgs() {
                if (this.canLoadMore && !this.pullDowning) {
                    this.$store.dispatch('getLocalHistoryMsgs',this.sessionId)
                }
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