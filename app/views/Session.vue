<template>
    <div class="g-inherit m-main p-session">
        <group class="u-list">
            <cell 
                v-for="(session,index) in sessionlist" 
                class="u-list-item" 
                :title="session.name" 
                :inline-desc="session.lastMsgShow" 
                :key="session.id" 
                :sessionId="session.id" 
                v-touch:swipeleft="showDelBtn" 
                v-touch:swiperight="hideDelBtn"
                @click.native="enterChat(session)"
            >
                <img class="icon u-circle" slot="icon" width="24" :src="session.avatar">
                <span class='u-session-time'>
                    {{session.updateTimeShow}}
                </span>
                <span v-show="session.unread > 0" class="u-unread">{{session.unread}}</span>
                <span class="u-tag-del" :class="{active: delSessionId===session.id}" @click="deleteSession"></span>
            </cell>
        </group>
        <span class="vux-1px">test</span>
        <icon type="success"></icon>
        <x-button type="primary" link="/demo">Go to demo list</x-button>
        <x-icon type="ios-arrow-up" class="icon-red"></x-icon>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                delSessionId: null,
                stopBubble: false
            }
        },
        computed: {
            userInfos() {
                return this.$store.state.userInfos
            },
            myInfo() {
                return this.$store.state.myInfo
            },
            myPhoneId() {
                return `${this.$store.state.userUID}`
            },
            sessionlist() {
                return [
                    {name:'test',lastMsgShow:'this is msg show',id:'12345',updateTimeShow:'0503',unread:1,avatar:'http://yx-web.nos.netease.com/webdoc/h5/im/default-group.png'}
                ]
            }
        },
        methods: {
            enterSysMsgs() {
                if (this.hideDelBtn())
                    return
                location.href = '#/sysmsgs'
            },
            enterChat(session) {
                if (this.hideDelBtn())
                    return
                if (session && session.id)
                    location.href = `#/chat/${session.id}`
            },
            enterMyChat() {
                // 我的手机页面
                location.href = `#/chat/p2p-${this.myPhoneId}`
            },
            deleteSession() {
                if (this.delSessionId !== null) {
                    this.$store.dispatch('deleteSession', this.delSessionId)
                }
            },
            showDelBtn(vNode) {
                console.log(vNode)
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
</style>
<style lang="less" scoped>
@button-global-height:100px;
</style>

