<template>

    <ul id="chat-list" class="p-chat-list">
      <li class="u-msg item-time" v-if="canLoadMore&&!isLoading">
        ---- 上拉加载更多 ----
      </li>
      <li class="u-msg item-time" v-if="!canLoadMore&&!isLoading">
        ---- 已无更多记录 ----
      </li>
      <load-more v-if="isLoading" :tip="'正在加载'"></load-more>
      <chat-item v-for="(msg,index) in msglist" :type="type" :rawMsg="msg" :isRobot="isRobot" :userInfos="userInfos" :myInfo="myInfo" :key="msg.idClient+'haha'+index" :isHistory='isHistory' @msg-loaded="msgLoaded"></chat-item>
    </ul>
</template>
<script type="text/javascript">
  import util from '../../utils'
  import config from '../../config/nim.config.js'
  import ChatItem from './ChatItem'
import { setTimeout } from 'timers';
  export default {
    components: {
      ChatItem
    },
    props: {
      type: String, // 类型，chatroom, session
      canLoadMore: [String, Boolean],
      isRobot: {
        type: Boolean,
        default () {
          return false
        }
      },
      msglist: {
        type: Array,
        default () {
          return []
        }
      },
      userInfos: {
        type: Object,
        default () {
          return {}
        }
      },
      myInfo: {
        type: Object,
        default () {
          return {}
        }
      },
      isHistory: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    mounted() {
      },
    updated(){
    },
    computed: {
      isNoData() {
        return this.msglist.length <= 0
      },
      isLoading() {
        return this.$store.state.isChatLoading
      }
    },
    data() {
      return {
        isFullImgShow: false,
        msgLoadedTimer: null,
        scrollY:0,
        scroll:null,
        gotoDown:true,
        currPagePos:0
      }
    },
    methods: {
      showFullImg(src) {
        this.$store.dispatch('showFullscreenImg', {
          src
        })
      },
      msgLoaded() {
        clearTimeout(this.msgLoadedTimer)
        this.msgLoadedTimer = setTimeout(() => {
          this.$emit('msgs-loaded')
        }, 20)
      }
    }
  }
</script>

<style type="text/css">
  .chat-wrapper{
    flex:1;
    width: 100%;
    height: 100%;
  }
  .p-chat-list {
    min-height: 101%;
    .u-icon {
      width: 22.4px;
      height: 25.6px;
      margin-right: 3.2px;
      vertical-align: bottom;
    }
  }
</style>