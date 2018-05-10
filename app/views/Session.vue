<template>
    <div class="g-inherit m-main p-session">
        <div class="session-wrapper" ref="sessionWrapper">
        <group class="u-list session-container">
            <cell v-for="(session) in sessionlist" class="u-list-item" :title="session.name" :inline-desc="session.lastMsgShow" :key="session.id" :sessionId="session.id" v-touch:swipeleft="showDelBtn" v-touch:swiperight="hideDelBtn" @click.native="enterChat(session)">
                <img class="icon u-circle" slot="icon" width="24" :src="session.avatar">
                <span class='u-session-time'>
                            {{session.updateTimeShow}}
                        </span>
                <span v-show="session.unread > 0" class="u-unread">{{session.unread}}</span>
                <span class="u-tag-del" :class="{active: delSessionId===session.id}" @click="deleteSession"></span>
            </cell>
        </group>
        </div>
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
        components:{
        },
        data() {
            return {
                delSessionId: null,
                stopBubble: false,
                isClick:false
            }
        },
        mounted(){

            },
        updated(){
            if(this.$refs.sessionWrapper){
                this.initScroll()
            }
        },
        computed: {
            userInfos(){
                return this.$store.state.userInfos
            },
            myPhoneId() {
                return this.$store.state.userUID
            },
            sessionlist() {
                let sessionlist = this.$store.state.sessionlist.filter(item => {
                    item.name = ''
                    item.avatar = ''
                    if (item.scene === 'p2p') {
                        let userInfo = null
                        if (item.to !== this.myPhoneId) {
                            userInfo = this.userInfos[item.to]
                        } else {
                            userInfo = this.myInfo
                            userInfo.alias = '我的手机'
                            userInfo.avatar = `${config.myPhoneIcon}`
                            return false
                        }
                        if (userInfo) {
                            item.name = util.getFriendAlias(userInfo)
                            item.avatar = userInfo.avatar
                        }
                    } else if (item.scene === 'team') {
                        return false
                        let teamInfo = null
                        if (teamInfo) {
                            item.name = teamInfo.name
                            item.avatar = teamInfo.avatar || (teamInfo.type === 'normal' ? this.myGroupIcon : this.myAdvancedIcon)
                        } else {
                            item.name = `群${item.to}`
                            item.avatar = item.avatar
                        }
                    }
                    let lastMsg = item.lastMsg || {}
                    if (lastMsg.type === 'text') {
                        item.lastMsgShow = lastMsg.text || ''
                    } else if (lastMsg.type === 'custom') {
                        item.lastMsgShow = lastMsg.text || ''
                    } else if (lastMsg.scene === 'team' && lastMsg.type === 'notification') {
                        item.lastMsgShow = util.generateTeamSysmMsg(lastMsg)
                    } else if (util.mapMsgType(lastMsg)) {
                        item.lastMsgShow = `[${util.mapMsgType(lastMsg)}]`
                    } else {
                        item.lastMsgShow = ''
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
                if(!this.isClick){
                    console.log('enterChat')
                    setTimeout(()=>{
                        this.isClick = false
                        if (this.hideDelBtn())
                            return
                        if (session && session.id)
                            this.$router.push(`/build/vuepage/chat/${session.id}`);
                    },20)
                }
                this.isClick = true
            },
            deleteSession() {
                if (this.delSessionId !== null) {
                    // this.$store.dispatch('deleteSession', this.delSessionId)
                }
            },
            showDelBtn(vNode) {
                if (vNode && vNode.data && vNode.data.attrs) {
                    this.delSessionId = vNode.data.attrs.sessionId
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
                    return true
                }
                return false
            },
            initScroll() {
                this.scroll = new BScroll(this.$refs.sessionWrapper, {
                    // probeType: 3,    
                    scrollY: true,
                    click: true,
                    // pullUpLoad: {   // 配置上啦加载
                    //   threshold: -80   //上啦80px的时候加载
                    // },
                    // openPullDown: true,
                    // pullDownRefresh: {
                    //     threshold: 50,
                    //     stop: 20
                    // },
                    mouseWheel: { // pc端同样能滑动
                        speed: 20,
                        invert: false
                    },
                    useTransition: true, // 防止iphone微信滑动卡顿
                });
                // this.scroll.on('pullingDown', (pos) => {
                //     // 判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
                //     if(!this.pullDowning){
                //         console.log(pos)
                //         this.getHistoryMsgs()
                //         this.pullDowning = true
                //         this.gotoDown = false
                //         this.scroll.closePullUp()
                //     }
                // });
            },
        }
    }
</script>

<style type="text/css">
    .p-session {
        .vux-cell-primary {
            max-width: 70%;
        }
    }
    .vux-x-icon {
        fill: #F70968;
    }
    .g-window .weui-cell::before {
        height: 1px;
    }
    .session-wrapper{
        height: 100%;
        overflow: hidden;
    }
    .session-container{
        height: 101%;
    }
</style>
<style lang="less" scoped>
    @button-global-height: 100px;
</style>

