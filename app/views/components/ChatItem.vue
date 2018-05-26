<template>
  <li class="u-msg" :class="{
        'item-me': msg.flow==='out',
        'item-you': msg.flow==='in',
        'item-time': msg.type==='timeTag',
        'item-tip': msg.type==='tip',
        'session-chat': type==='session'
      }">
    <div v-if="msgs.type==='timeTag'">{{msg.showText}}</div>
    <div v-else-if="msg.type==='tip'" class="tip">{{msg.showText}}</div>
    <div v-else-if="msg.type==='notification' && msg.scene==='team'" class="notification">{{msg.showText}}</div>
    <div v-else-if="msg.flow==='in' || msg.flow==='out'" :idClient="msg.idClient" :time="msg.time" :flow="msg.flow" :type="msg.type">
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
      <span v-else-if="msg.type==='question'" class="msg-text" ref="mediaMsg">
        <a :href="msg.questionLink" class="msg-share-container">
          <p class="msg-share-title">{{msg.questionTitle}}</p>
          <section class="msg-share-content hg-word-clamp hg-word-clamp-2">{{msg.showText}}</section>
        </a>
        <span class="msg-share-tip">{{'我向您发送随访问卷'}}</span>
      </span>
      <span v-else-if="msg.type==='image'" class=" msg-image" ref="mediaMsg" @click.stop="showFullImg(msg.fileDataUrl)"></span>
      <span v-else-if="msg.type==='video'" class=" msg-video" ref="mediaMsg" @click.stop="showFullVideo(msg.fileDataUrl,msg.coverUrl)">
        <section class="msg-video-container" :style="'background:url('+msg.coverUrl+') center center / 100% no-repeat'">
          <div class="hg-banner-cover"></div>
          <img src="../../img/video-play.png" class="play-flag" alt="">
          <span class="video-duration">{{msg.duration}}</span>
        </section>
      </span>
      <span v-else-if="msg.type==='audio'" :class="!isAudioPlay?'msg-text':'msg-text active'" :style="'width:'+msg.audioDuration" @click.stop="playMyAudio(msg.audioSrc,msg.localAudioSrc)">
        <i class="icon-audio"></i>
        <i class="audio-hasPlay" v-if="msg.flow==='in'&&!msg.hasRead"></i>
        <span class="audio-duration">{{msg.showText}}</span>
      </span>
      <span v-else-if="msg.type==='file'" class="msg-text"><a :href="msg.fileLink" target="_blank"><i class="u-icon icon-file"></i>{{msg.showText}}</a></span>
      <span v-else-if="msg.type==='notification'" class="msg-text notify">{{msg.showText}}</span>
      <span v-else class="msg-text" v-html="msg.showText"></span>
      <span v-if="msg.status==='sending'" class="msg-failed"><spinner type="android"></spinner></span>
      <span v-if="msg.status==='fail'" class="msg-failed" @click="confirmResend(msg.id)"><i class="weui-icon-warn"></i></span>
      <a v-if="teamMsgUnRead >=0" class='msg-unread' :href='`#/msgReceiptDetail/${msg.to}-${msg.idServer}`'>{{teamMsgUnRead>0 ? `${teamMsgUnRead}人未读`: '全部已读'}}</a>
    </div>
  </li>
</template>

<script type="text/javascript">
  import util from '../../utils'
  import config from '../../config/nim.config.js'
  import wxSdk from '../../utils/wxSdk'
  import emojiObj from '../../config/emoji'
  import '../../style/stylus/public.styl'
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
        customMsg: {},
        msgId:null,
        wxSdk: wxSdk ? wxSdk() : {},
        currentLocalId:null
      }
    },
    computed: {
      msgs(){
        this.msgInitShow()
        return this.rawMsg
      },
      robotInfos() {
        return this.$store.state.robotInfos
      },
      teamMsgUnRead() {
        var obj = !this.isHistory &&
          this.msg.needMsgReceipt &&
          this.msg.flow === 'out' &&
          this.$store.state.teamMsgReads.find(item => item.idServer === this.msg.idServer)
        return obj ? parseInt(obj.unread) : -1
      },
      isAudioPlay(){
        let currMsgAudioId = this.$store.state.currMsgAudioId
        if(currMsgAudioId && currMsgAudioId === this.msgId){
          this.startAudio()
          return true
        }else{
          if(this.currentLocalId){
            this.wxSdk.audio.stopAudio(this.currentLocalId)
          }else{
            if(this.currentAudio){
              this.currentAudio.pause()
            }
          }
          return false
        }
      }
    },
    beforeMount() {
      this.msgInitShow()
    },
    mounted() {
      let item = this.msg
      // 有时序问题的操作
      this.$nextTick(() => {
        let media = null
        let hasReload = false
        if (item.type === 'image') {
          // 图片消息缩略图
          media = new Image()
          console.log(item.mediaContent)
          media.src = item.flow==='out'?item.mediaContent.fileDataLocalPath:item.mediaContent.thumbnailUrl
          media.onerror="this.src='"+item.mediaContent.thumbnailUrl+"'"
          media.height = 128
          media.width = item.mediaContent.pWidth?(item.mediaContent.pWidth/item.mediaContent.pHeight * 128):'100%'
        }
        if (media) {
          if (this.$refs.mediaMsg) {
            this.$refs.mediaMsg.appendChild(media)
          }
          media.onload = () => {
            console.log('seucces-img')
            this.$emit('msg-loaded')
          }
          media.onerror = () => {
            if(!hasReload){
              media.src = item.mediaContent.thumbnailUrl
            }
            hasReload = true
            console.log('error-img')
            this.$emit('msg-loaded')
          }
        } else {
          this.$emit('msg-loaded')
        }
      }) // end this.nextTick
    },
    beforeUpdate(){
      this.msgInitShow()
    },
    updated(){
    },
    methods: {
      confirmResend(id) {
        let that = this
        this.$vux.confirm.show({
          title: '是否重发该消息',
          onCancel() {},
          onConfirm() {
            that.$store.dispatch('resendMsg', {
              id: id,
              msg: that.rawMsg
            })
          }
        })
      },
      showFullImg(src) {
        this.$store.dispatch('showFullscreenImg', {
          src
        })
      },
      showFullVideo(src,cover){
        this.$store.dispatch('showFullscreenVideo', {
          src,
          cover
        })
      },
      playMyAudio(src,localSrc) {
        if(localSrc){
          this.currentLocalId = localSrc
        }
        if(!this.currentAudio){
          this.currentAudio = new Audio(src)
        }
        this.$store.dispatch('updateCurrMsgAudioId',this.msgId)
        
      },
      startAudio(){
        if(this.rawMsg.flow==='out'&&this.currentLocalId){
          this.wxSdk.audio.playAudio(this.currentLocalId)
          this.wxSdk.audio.onVoicePlayEnd(()=>{
            debugger
            alert('tingzhi')
            this.$store.dispatch('updateCurrMsgAudioId','')
          })
        }else{
          if(!this.currentAudio) return
          this.currentAudio.load()
          this.currentAudio.play()
          this.currentAudio.onended = () => {
            this.$store.dispatch('updateCurrMsgAudioId','')
          }
        }
        //若第一次播放，进行数据库更新，已读
        let msg = this.rawMsg
        if(!msg.hasRead){
          msg.hasRead = true
          this.$store.dispatch('updateMsg',msg)
        }
      },
      toMsgUnReadDetail() {
        this.href = '#/msgReceiptDetail/' + this.msg.idServer
      },
      msgInitShow(){
        let msg = Object.assign({}, this.rawMsg)
        this.msgId = msg.id

        let content = msg
        let avatar = ''
        if(content.fromUserAccid && this.userInfos[content.fromUserAccid]){
          avatar = this.userInfos[content.fromUserAccid].userAvatar
        }else{
          avatar = content.fromUserAvatarUrl
        }

        this.customMsg['avatar'] = avatar || config.defaultUserIcon

        let mediaContent = content.mediaContent||{}
        if(mediaContent && typeof mediaContent === 'string'){
          mediaContent = JSON.parse(mediaContent)
        }
        this.customMsg['mediaContent'] = mediaContent
        switch (content.messageContentType) {
          case 1:
            this.customMsg['showText'] = content.textContent;
            this.customMsg['type'] = 'text';
            break; //文本
          case 2:
            this.customMsg['localAudioSrc'] = mediaContent.fileDataLocalPath;
            this.customMsg['audioSrc'] = mediaContent.fileDataUrl;
            let length = mediaContent.voiceDuration>=60?60:mediaContent.voiceDuration
            let duration = Math.round((length/60)*0.5*100)
            this.customMsg['audioDuration'] = (duration<=4?4:duration) +'%' ;
            this.customMsg['showText'] = Math.round(mediaContent.voiceDuration||0)+'\'\'';
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
            this.customMsg['fileDataUrl'] = mediaContent.fileDataUrl;
            this.customMsg['coverUrl'] = mediaContent.coverUrl;
            this.customMsg['duration'] = util.getVideoTime(mediaContent.duration||0);
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
            this.customMsg['questionLink'] = mediaContent.shareLink;
            this.customMsg['questionTitle'] = mediaContent.shareTitle;
            this.customMsg['showText'] = mediaContent.shareBrief;
            this.customMsg['type'] = 'question';
            break; //问卷
        }
        
        this.msg = this.customMsg || msg
        this.msg.flow = msg.flow
        this.msg.status = msg.status
        this.msg.hasRead = msg.hasRead
        this.msg.id = msg.id
        if (msg.type === 'timeTag') {
          // 标记发送的时间
          this.msg.type = msg.type
          this.msg.showText = msg.text
        }
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
    width: 180px;
    overflow: hidden;
  }
  .item-me{
    .msg-video{
      float: right;
    }
    .msg-image{
      float: right;
    }
    .icon-audio{
      transform: rotate(180deg);
      width: 14px;
      height: 19.2px;
      display: inherit;
      background-image: url('../../img/voice-white-end.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  } 
  .item-me .active .icon-audio{
        background-image: url('../../img/voice-white-start.gif');
  }
  .audio-duration{
    position: absolute;
    right: -40px;
    bottom: 0;
    color: #ccc;
    display: inline-block;
    width: 30px;
  }
  .audio-hasPlay{
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #fb699d;
    right: -20px;
    top: 0;
  }
  .item-me{
    .audio-duration{
      left: -40px;
      text-align: right;
    }
    .audio-hasPlay{
      left: -20px;
    }
  }
  .item-you{
    .msg-video{
      float: left;
    }
    .msg-image{
      float: left;
    }
    .icon-audio{
      width: 14px;
      height: 19.2px;
      display: inherit;
      background-image: url('../../img/voice-black-end.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  } 
  .item-you .active .icon-audio{
        background-image: url('../../img/voice-black-start.gif');
  }
  .msg-video .msg-video-container{
    position: relative;
    width:100%;
    height:100%;
    display:flex;
    justify-content: center;
    align-items: center;
    .hg-banner-cover{
        background-color: black;
        opacity: 0.3;
        width: 100%;
        position: absolute;
        z-index: 1;
    }
    .play-flag{
      width: 50px;
      height: 50px;
      z-index: 2;
    }
    .video-duration{
      font-size: 16px;
      color: #ffffff;
      z-index: 2;
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
  }

  .msg-image {
    height: 128px !important;
    min-width: 80px;
  }
</style>