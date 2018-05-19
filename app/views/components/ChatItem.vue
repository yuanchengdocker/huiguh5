<template>
  <li class="u-msg" :class="{
        'item-me': msg.flow==='out',
        'item-you': msg.flow==='in',
        'item-time': msg.type==='timeTag',
        'item-tip': msg.type==='tip',
        'session-chat': type==='session'
      }">
    <div v-if="msg.type==='timeTag'">{{msg.showText}}</div>
    <div v-else-if="msg.type==='tip'" class="tip">{{msg.showText}}</div>
    <div v-else-if="msg.type==='notification' && msg.scene==='team'" class="notification">{{msg.showText}}</div>
    <div v-else-if="msg.flow==='in' || msg.flow==='out'" :idClient="msg.idClient" :time="msg.time" :flow="msg.flow" :type="msg.type" v-touch:hold="revocateMsg">
      <a class="msg-head" v-if="msg.avatar" :href="msg.link">
        <img class="icon u-circle" :src="msg.avatar">
      </a>
      <p class="msg-user" v-else-if="msg.type!=='notification'"><em>{{msg.showTime}}</em>{{msg.from}}</p>
      <span v-if="msg.type==='text'" class="msg-text" v-html="msg.showText"></span>
      <span v-else-if="msg.type==='article'" class="msg-text" ref="mediaMsg">
        <a :href="msg.articleLink" class="msg-share-container">
          <p class="msg-share-title">{{msg.articleTitle}}</p>
          <section class="msg-share-content hg-word-clamp hg-word-clamp-2">{{msg.showText}}</section>
        </a>
        <span class="msg-share-tip">{{'我向您分享的患教资料'}}</span>
      </span>
      <span v-else-if="msg.type==='qustion'" class="msg-text" ref="mediaMsg">
        <a :href="msg.qustionLink" class="msg-share-container">
          <p class="msg-share-title">{{msg.qustionTitle}}</p>
          <section class="msg-share-content hg-word-clamp hg-word-clamp-2">{{msg.showText}}</section>
        </a>
        <span class="msg-share-tip">{{'我向您发送随访问卷'}}</span>
      </span>
      <span v-else-if="msg.type==='image'" class=" msg-image" ref="mediaMsg" @click.stop="showFullImg(msg.fileDataUrl)"></span>
      <span v-else-if="msg.type==='video'" class=" msg-video" ref="mediaMsg"></span>
      <span v-else-if="msg.type==='audio'" class="msg-text" @click="playAudio(msg.audioSrc)">{{msg.showText}}</span>
      <span v-else-if="msg.type==='file'" class="msg-text"><a :href="msg.fileLink" target="_blank"><i class="u-icon icon-file"></i>{{msg.showText}}</a></span>
      <span v-else-if="msg.type==='notification'" class="msg-text notify">{{msg.showText}}</span>
      <span v-else class="msg-text" v-html="msg.showText"></span>
      <span v-if="msg.status==='fail'" class="msg-failed" @click="confirmResend(msg.id)"><i class="weui-icon-warn"></i></span>
      <a v-if="teamMsgUnRead >=0" class='msg-unread' :href='`#/msgReceiptDetail/${msg.to}-${msg.idServer}`'>{{teamMsgUnRead>0 ? `${teamMsgUnRead}人未读`: '全部已读'}}</a>
    </div>
  </li>
</template>

<script type="text/javascript">
  import util from '../../utils'
  import config from '../../config/nim.config.js'
  import emojiObj from '../../config/emoji'
  export default {
    props: {
      type: String, // 类型，chatroom, session
      rawMsg: {
        type: Object,
        default () {
          return {}
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
      isRobot: {
        type: Boolean,
        default () {
          return false
        }
      },
      isHistory: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    data() {
      return {
        msg: '',
        isFullImgShow: false,
        currentAudio: null,
        customMsg: {}
      }
    },
    computed: {
      robotInfos() {
        return this.$store.state.robotInfos
      },
      teamMsgUnRead() {
        var obj = !this.isHistory &&
          this.msg.needMsgReceipt &&
          this.msg.flow === 'out' &&
          this.$store.state.teamMsgReads.find(item => item.idServer === this.msg.idServer)
        return obj ? parseInt(obj.unread) : -1
      }
    },
    beforeMount() {
      let item = Object.assign({}, this.rawMsg)
      // 标记用户，区分聊天室、普通消息
      if (this.type === 'session') {
        if (item.flow === 'in') {
          if (item.type === 'robot' && item.content && item.content.msgOut) {
            // 机器人下行消息
            let robotAccid = item.content.robotAccid
            item.avatar = this.robotInfos[robotAccid].avatar
            item.isRobot = true
            item.link = `#/namecard/${robotAccid}`
          } else if (item.from !== this.$store.state.userUID) {
            item.avatar = (this.userInfos[item.from] && this.userInfos[item.from].avatar) || config.defaultUserIcon
            item.link = `#/namecard/${item.from}`
            //todo  如果是未加好友的人发了消息，是否能看到名片
          } else {
            item.avatar = this.myInfo.avatar
          }
        } else if (item.flow === 'out') {
          item.avatar = this.myInfo.avatar
        }
      } else {
        // 标记时间，聊天室中
        item.showTime = util.formatDate(item.time)
      }
      if (item.type === 'custom') {
        let data = JSON.parse(item.content)
        let content = data.data
        if (content && content.chatType === 1) { //单聊
          this.customMsg['avatar'] = content.fromUserAvatarUrl || item.avatar
          let mediaContent = content.mediaContent
          if(mediaContent && typeof mediaContent === 'string'){
            mediaContent = JSON.parse(mediaContent)
          }
          this.customMsg['mediaContent'] = mediaContent
          // this.customMsg['file'] = {
          //   url: mediaContent.fileDataUrl
          // }
          switch (content.messageContentType) {
            case 1:
              this.customMsg['showText'] = content.textContent;
              this.customMsg['type'] = 'text';
              break; //文本
            case 2:
              this.customMsg['audioSrc'] = mediaContent.fileDataUrl;
              this.customMsg['showText'] = Math.round(mediaContent.voiceDuration / 1000) + '" 点击播放';
              this.customMsg['type'] = 'audio';
              break; //语音
            case 3:
              this.customMsg['fileDataUrl'] = mediaContent.fileDataUrl;
              this.customMsg['originLink'] = mediaContent.originLink;
              this.customMsg['type'] = 'image';
              break; //图片
            case 4:
              this.customMsg['showText'] = content.textContent;
              this.customMsg['type'] = 'tip';
              break; //提示内容
            case 5:
              this.customMsg['shareLink'] = content.textContent;
              this.customMsg['type'] = 'share';
              break; //分享内容
          
            case 11:
              this.customMsg['type'] = 'video';
              break; //视频
            case 12:
              this.customMsg['fileLink'] = content.textContent;
              this.customMsg['showText'] = content.textContent;
              this.customMsg['type'] = 'file';
              break; //文件
            case 14:
              this.customMsg['articleLink'] = mediaContent.shareLink;
              this.customMsg['articleTitle'] = mediaContent.shareTitle;
              this.customMsg['showText'] = mediaContent.shareBrief;
              this.customMsg['type'] = 'article';
              break; //患教资料
            case 15:
              this.customMsg['qustionLink'] = mediaContent.shareLink;
              this.customMsg['qustionTitle'] = mediaContent.shareTitle;
              this.customMsg['showText'] = mediaContent.shareBrief;
              this.customMsg['type'] = 'qustion';
              break; //问卷
          }
        }
      } else if (item.type === 'text') {
        // 文本消息
        item.showText = util.escape(item.text)
        if (/\[[^\]]+\]/.test(item.showText)) {
          let emojiItems = item.showText.match(/\[[^\]]+\]/g)
          emojiItems.forEach(text => {
            let emojiCnt = emojiObj.emojiList.emoji
            if (emojiCnt[text]) {
              item.showText = item.showText.replace(text, `<img class="emoji-small" src="${emojiCnt[text].img}">`)
            }
          })
        }
      } else {
        this.customMsg['avatar'] = item.avatar
        this.customMsg['showText'] = `[${util.mapMsgType(item)}],请到手机或电脑客户端查看`
      }
      this.msg = this.customMsg || item
      this.msg.flow = item.flow
      this.msg.status = item.status
      this.msg.id = item.id
      if (item.type === 'timeTag') {
        // 标记发送的时间
        this.msg.type = item.type
        this.msg.showText = item.text
      }
    },
    mounted() {
      let item = this.msg
      // 有时序问题的操作
      this.$nextTick(() => {
        let media = null
        if (item.type === 'image') {
          // 图片消息缩略图
          media = new Image()
          media.src = item.mediaContent.thumbnailUrl + '?imageView&thumbnail=180x0&quality=85'
          media.height = 128
          media.width = item.mediaContent.pWidth/item.mediaContent.pHeight * 128
        }else if (item.type === 'video') {
          // if (/(mov|mp4|ogg|webm)/i.test(item.file.ext)) {
          media = document.createElement('video')
          media.src = item.file.url
          media.width = 640
          media.height = 480
          media.autoStart = false
          media.preload = 'metadata'
          media.controls = 'controls'
          // } else {
          //   let aLink = document.createElement('a')
          //   aLink.href = item.file.url
          //   aLink.target = '_blank'
          //   aLink.innerHTML = `<i class="u-icon icon-file"></i>${video.name}`
          //   this.$refs.mediaMsg.appendChild(aLink)
          // }
        }
        if (media) {
          if (this.$refs.mediaMsg) {
            this.$refs.mediaMsg.appendChild(media)
          }
          media.onload = () => {
            this.$emit('msg-loaded')
          }
          media.onerror = () => {
            this.$emit('msg-loaded')
          }
        } else {
          this.$emit('msg-loaded')
        }
      }) // end this.nextTick
    },
    methods: {
      confirmResend(id) {
        let that = this
        this.$vux.confirm.show({
          title: '是否重发该消息' + id,
          onCancel() {},
          onConfirm() {
            that.$store.dispatch('resendMsg', {
              id: id,
              msg: that.rawMsg
            })
          }
        })
      },
      revocateMsg(vNode) {
        // 在会话聊天页
        if (this.$store.state.currSessionId) {
          if (vNode && vNode.data && vNode.data.attrs) {
            let attrs = vNode.data.attrs
            if (attrs.type === 'robot') {
              return
            }
            // 自己发的消息
            if (attrs.flow === 'out') {
              let that = this
              this.$vux.confirm.show({
                title: '确定需要撤回消息',
                onCancel() {},
                onConfirm() {
                  that.$store.dispatch('revocateMsg', {
                    idClient: attrs.idClient
                  })
                }
              })
            }
          }
        }
      },
      showFullImg(src) {
        this.$store.dispatch('showFullscreenImg', {
          src
        })
      },
      playAudio(src) {
        // var mp3Url = nim.audioToMp3({
        //     url: src
        // })
        alert(src)
        if (!this.currentAudio) {
          this.currentAudio = new Audio(src)
          this.currentAudio.load()
        }
        this.currentAudio.play()
        this.currentAudio.onended = () => {
          this.currentAudio = null
        }
      },
      toMsgUnReadDetail() {
        this.href = '#/msgReceiptDetail/' + this.msg.idServer
      }
    }
  }
</script>

<style scoped>
  .p-chat-history {
    .u-msg {
      .msg-link {
        display: none;
      }
    }
  }
  .p-room-chat-list {
    .u-msg {
      .msg-text {
        max-width: 80%;
      }
      .msg-link {
        bottom: 0;
        right: -64px;
        font-size: 14.4px;
      }
    }
  }
  .msg-unread {
    position: relative;
    float: right;
    top: 4.8px;
    right: 8px;
    font-size: 14.4px;
    color: #0091e4;
  }
  .msg-video {
    height: 128px !important;
  }
  .msg-image {
    height: 128px !important;
  }
</style>