<template>
    <div class="g-inherit m-main p-session">
        <group class="u-list">
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
</template>

<script>
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
        data() {
            return {
                delSessionId: null,
                stopBubble: false,
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
                if (this.hideDelBtn())
                    return
                if (session && session.id)
                    this.$router.push(`/build/vuepage/chat/${session.id}`);
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
            }
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
</style>
<style lang="less" scoped>
    @button-global-height: 100px;
</style>

