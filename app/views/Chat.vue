<template>
    <div class="g-inherit m-article">
        <x-header class="m-tab" :left-options="leftBtnOptions" @on-click-back="onClickBack">
            <h1 class="m-tab-top" @click="enterNameCard">{{sessionName}}</h1>
            <a slot="left"></a>
            <div class="m-tab-right" slot="right">
                <!-- <span class='icon-history' @click='onHistoryClick'></span>
                <span v-if="scene==='team'" class='icon-team' @click="onTeamManageClick"></span> -->
            </div>
        </x-header>
        <div class="m-chat-main">
            <chat-list 
            v-touch:swipedown="loadMoreChat" type="session" :msglist="msglist" :canLoadMore="canLoadMore" :userInfos="userInfos" :myInfo="myInfo"></chat-list>
            <chat-editor type="session" :scene="scene" :to="to"></chat-editor>
        </div>
    </div>
</template>

<script>
    import ChatEditor from './components/ChatEditor'
    import ChatList from './components/ChatList'
    import util from '../utils'
    import pageUtil from '../utils/page'
    import {
        mapActions,
        mapState
    } from 'vuex'
import { setTimeout } from 'timers';
    export default {
        components: {
            ChatEditor,
            ChatList
        },
        props: ['id'],
        created() {
            this.getLocalSessionMsg({sessionId:this.sessionId})
            this.updateMenuBarShow(false)

        },
        // 进入该页面，文档被挂载
        mounted() {
            // 此时设置当前会话
            this.$store.dispatch('setCurrSession', this.sessionId)
            pageUtil.scrollChatListDown()

            // this.$store.dispatch('resetNoMoreHistoryMsgs')
            // this.getHistoryMsgs()
            
        },
        updated() {
            let tempPagePos = pageUtil.getChatListHeight()
            if(this.canLoadMore){
                pageUtil.scrollChatListDown(tempPagePos - this.currPagePos)
            }
            this.currPagePos = tempPagePos
            console.log(this.currPagePos,'this.currPagePos')
            if(this.gotoDown){
                pageUtil.scrollChatListDown()
            }else{
            }
            this.gotoDown = true
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
                gotoDown:true
            }
        },
        computed: {
            sessionId() {
                let sessionId = this.$route.params.sessionId
                return sessionId
            },
            sessionName() {
                let sessionId = this.sessionId
                let user = null
                if (/^p2p-/.test(sessionId)) {
                    user = sessionId.replace(/^p2p-/, '')
                    if (user === this.$store.state.userUID) {
                        return '我的手机'
                    } else {
                        let userInfo = this.userInfos[user] || {}
                        return util.getFriendAlias(userInfo)
                    }
                } else if (/^team-/.test(sessionId)) {
                    if (this.teamInfo) {
                        // teamInfo中的人数为初始获取的值，在人员增减后不会及时更新，而teamMembers在人员增减后同步维护的人员信息
                        var members = this.$store.state.teamMembers && this.$store.state.teamMembers[this.teamInfo.teamId]
                        var memberCount = members && members.length
                        return this.teamInfo.name + (memberCount ? `(${memberCount})` : '')
                    } else {
                        return '群'
                    }
                }
            },
            scene() {
                console.log(this.sessionId)
                return util.parseSession(this.sessionId).scene
            },
            to() {
                return util.parseSession(this.sessionId).to
            },
            myInfo() {
                return this.$store.state.myInfo
            },
            userInfos() {
                return this.$store.state.userInfos
            },
            robotInfos() {
                return this.$store.state.robotInfos
            },
            msglist() {
                let msgs = this.$store.state.currSessionMsgs
                if(document.getElementById('chat-list')){
                    let tempPagePos = pageUtil.getChatListHeight()
                    this.currPagePos = tempPagePos
                    console.log(this.currPagePos,'this.msglist')
                }
                return msgs
            },
            canLoadMore(){
                return !this.$store.state.noMoreHistoryMsgs
            }
        },
        methods: {
            ...mapActions(['updatedLoadingStatus', 'updateMenuBarShow','getLocalSessionMsg']),
            onClickBack() {
                this.$router.push(`/build/vuepage/session`);
            },
            loadMoreChat(){
                if(pageUtil.getChatListScroll() === 0){
                    console.log('下拉')
                    this.gotoDown = false
                    this.getHistoryMsgs()
                }
            },
            // msgsLoaded() {
            //     console.log('msgsLoaded')
            //     let tempPagePos = pageUtil.getChatListHeight()
            //     pageUtil.scrollChatListDown(tempPagePos - this.currPagePos)
            //     this.currPagePos = tempPagePos
            //     if(this.gotoDown){
            //         pageUtil.scrollChatListDown()
            //     }
            //     this.gotoDown = true
            // },
            enterNameCard() {
                if (/^p2p-/.test(this.sessionId)) {
                    let account = this.sessionId.replace(/^p2p-/, '')
                    if (account === this.$store.state.userUID) {
                        location.href = `#/general`
                        return
                    }
                    location.href = `#/namecard/${account}`
                }
            },
            onHistoryClick() {
                if (this.scene !== 'team') {
                    location.href = `#/chathistory/${this.sessionId}`
                } else {
                    this.$toast('您已退出该群')
                }
            },
            getHistoryMsgs () {
                if (this.canLoadMore) {
                    this.$store.dispatch('getHistoryMsgs', {
                    scene: this.scene,
                    to: this.to
                    })
                }
            },
        }
    }
</script>
<style scoped>
    .g-window .m-tab .m-tab-right {
        width: 5rem;
        right: -1rem;
    }
    .m-tab-right {
        display: flex;
        justify-content: flex-end;
        .icon-history,
        .icon-team {
            display: inline-block;
            margin-right: .8rem;
            width: 1.7rem;
            height: 1.7rem;
            background: url(http://yx-web.nos.netease.com/webdoc/h5/im/icons.png);
            background-size: 20rem;
            background-position: -5.8rem -11.3rem;
        }
        .icon-team {
            background-position: -7.9rem -11.3rem;
        }
    }
    .invalidHint {
        width: 100%;
        height: 2rem;
        line-height: 2rem;
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