<template>
    <div class="g-inherit m-main p-session">
        <div class="session-wrapper" ref="sessionWrapper">
            <group class="u-list session-container">
                <cell v-for="(session) in sessionlist" class="u-list-item" :title="session.name" :inline-desc="session.lastMsgShow" :key="session.id" :userName="session.name" :sessionId="session.id" v-touch:swipeleft="showDelBtn" v-touch:swiperight="hideDelBtn" @click.native="enterChat(session)">
                    <img class="icon u-circle" slot="icon" width="24" :src="session.avatar">
                    <span class='u-session-time'>
                                {{session.updateTimeShow}}
                            </span>
                    <span v-show="session.unread > 0" class="u-unread">{{session.unread}}</span>
                    <span class="u-tag-del" :class="{active: delSessionId===session.id}" @click.stop="deleteSession"></span>
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
        components: {},
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
            this.$store.dispatch('getLocalSession')
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

                    if (lastMsg.type === 'custom') {
                        let data = JSON.parse(lastMsg.content)
                        let content = data.data
                        if (content && content.chatType === 1) { //单聊
                        // item['avatar'] = content.fromUserAvatarUrl||item.avatar

                        switch(content.messageContentType){
                            case 1: item.lastMsgShow = content.textContent || '';lastMsg['type']='text'; break; //文本
                            case 2: 
                            lastMsg['type']='audio'; break; //语音
                            case 3: lastMsg['type']='image'; break; //图片
                            case 4: lastMsg['type']='tip'; break; //提示内容
                            case 5: lastMsg['type']='share'; break; //分享内容
                            case 6: lastMsg['type']='appoint'; break; //预约内容
                            case 7: lastMsg['type']='follow'; break; //随访内容
                            case 8: 
                            lastMsg['type']='file'; break; //文件
                        }
                        }
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
                    console.log('enterChat')
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
                    console.log(e)
                    let _this = this
                    setTimeout(() => {
                        this.isDelClick = false
                        if (this.delSessionId !== null) {
                            this.$vux.confirm.show({
                                title: `确定要删除与${_this.delUserName}的对话吗？`,
                                onConfirm () {
                                    _this.$store.dispatch('deleteSession', _this.delSessionId)
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

