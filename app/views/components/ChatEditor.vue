<template>
  <div class="m-chat-editor">
    <div class="component-dialogue-bar-person">
      <span class="iconfont icon-dialogue-jianpan" v-show="currentChatWay === 2" v-on:click="currentChatWay=1"></span>
      <span class="iconfont icon-dialogue-voice" v-show="currentChatWay != 2" v-on:click="currentChatWay=2"></span>
      <div class="chat-way" v-show="currentChatWay === 2">
        <div class="chat-say" v-press="{callback:getAudioFilPath}">
          <span class="one">按住 说话</span>
          <span class="two">松开 结束</span>
        </div>
      </div>
      <div class="chat-way" v-show="currentChatWay != 2">
        <form action="" onsubmit="return false;" value="发送">
          <input class="chat-txt" v-model="msgToSent" type="text" @focus="focusIpt" @keyup.enter="sendTextMsg()" />
        </form>
      </div>
      <span class="more iconfont icon-dialogue-jia" v-on:click="currentChatWay ===3 ? currentChatWay=1 : currentChatWay =3 "></span>
      <div class="recording" style="display: none;" id="recording">
        <div class="recording-voice" style="display: none;" id="recording-voice">
          <div class="voice-inner">
            <div class="voice-icon"></div>
            <div class="voice-volume">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <p>手指上划,取消发送</p>
        </div>
        <div class="recording-cancel" style="display: none;">
          <div class="cancel-inner"></div>
          <p>松开手指,取消发送</p>
        </div>
      </div>
    </div>
    <div class="more-send-option" v-show="currentChatWay === 3" ref="chatMoreOption">
      <section class="option-item" @click="goAlbum(1)"><input @change="sendFileMsg" v-show="false" type="file" multiple="multiple" size="9" accept="image/*" /><img src="../../img/album.png" />
      </section>
      <section class="option-item" @click="goAlbum(2)"><input @change="sendFileMsg" v-show="false" type="file" accept="audio/*" capture="microphone" /><img src="../../img/camera.png" />
      </section>
    </div>
  </div>
</template>

<script>
  // import ChatEmoji from './ChatEmoji'
  import util from '../../utils'
  import config from '../../config/nim.config.js'
  import pageUtil from '../../utils/page'
  import axios from '../../service/service'
  import "../../style/stylus/dialogue.styl"
  import wxSdk from '../../utils/wxSdk'
  import {
    Duplex
  } from 'stream';
  export default {
    props: {
      type: String,
      scene: String,
      to: String,
      isRobot: {
        type: Boolean,
        default () {
          return false
        }
      },
      invalid: {
        type: Boolean,
        default: false
      },
      invalidHint: {
        type: String,
        default: '您无权限发送消息'
      },
      advancedTeam: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      currentChatWay(curVal){
        let more = this.$refs.chatMoreOption
        if(curVal === 3){
          document.addEventListener("click",this.hideMoreOption);
          more.addEventListener("click",(event)=>{
              event=event||window.event;
              event.stopPropagation();
          });
        }else{
          document.removeEventListener('click',this.hideMoreOption)
        }
      },
      msgToSent(curVal, oldVal) {
        if (this.isRobot) {
          return
        }
        let indexAt = this.msgToSent.indexOf('@')
      }
    },
    directives: {
      press: {
        bind(element, binding) {
          var startTx, startTy, isCancel
          element.addEventListener('touchstart', function(e) {
            // 为什么每次注册监听器,都要重新获取一次 DOM 像上面写就 undefine?
            var recording = document.querySelector('.recording'),
              recordingVoice = document.querySelector('.recording-voice')
            element.className = "chat-say say-active"
            recording.style.display = recordingVoice.style.display = "block"
            // console.log('start')
            if (this.wxSdk.isWx) {
              console.log('开始语音')
              this.wxSdk.audio.start()
            }
            isCancel = false
            var touches = e.touches[0]
            startTx = touches.clientX
            startTy = touches.clientY
            e.preventDefault()
          }, false)
          element.addEventListener('touchend', function(e) {
            var recording = document.querySelector('.recording'),
              recordingVoice = document.querySelector('.recording-voice'),
              recordingCancel = document.querySelector('.recording-cancel')
            element.className = "chat-say"
            recordingCancel.style.display = recording.style.display = recordingVoice.style.display = "none"
            // console.log('end')
            if (this.wxSdk.isWx) {
              if (isCancel) {
                console.log('取消语音')
              } else {
                this.wxSdk.audio.stop().then((res) => {
                  console.log('录音结束。。。。')
                  binding.value.callback(res)
                })
              }
            }
            e.preventDefault()
          }, false)
          element.addEventListener('touchmove', function(e) {
            var recording = document.querySelector('.recording'),
              recordingVoice = document.querySelector('.recording-voice'),
              recordingCancel = document.querySelector('.recording-cancel')
            var touches = e.changedTouches[0],
              endTx = touches.clientX,
              endTy = touches.clientY,
              distanceX = startTx - endTx,
              distanceY = startTy - endTy;
            if (distanceY > 10) {
              // 控制范围 和谐掉指尖抖动
              // element.className = "chat-say"
              recordingVoice.style.display = "none"
              recordingCancel.style.display = "block"
              isCancel = true
            } else {
              recordingVoice.style.display = "block"
              recordingCancel.style.display = "none"
              isCancel = false
            }
            // 阻断事件冒泡 防止页面被一同向上滑动
            e.preventDefault()
          }, false);
        }
      },
      more: {
        bind(element, binding) {
          var startTx, startTy
          element.addEventListener('touchstart', function(e) {
            var msgMore = document.getElementById('msg-more'),
              touches = e.changedTouches[0],
              startTx = touches.clientX,
              startTy = touches.clientY
            // 控制菜单的位置
            msgMore.style.left = ((startTx - 18) > 180 ? 180 : (startTx - 18)) + 'px'
            msgMore.style.top = (element.offsetTop - 33) + 'px'
            msgMore.style.display = "block"
            e.preventDefault()
          }, false)
          element.addEventListener('touchend', function(e) {
            e.preventDefault()
          }, false)
        }
      }
    },
    data() {
      return {
        msgToSent: '',
        icon1: `${config.resourceUrl}/im/chat-editor-1.png`,
        icon2: `${config.resourceUrl}/im/chat-editor-2.png`,
        icon3: `${config.resourceUrl}/im/chat-editor-3.png`,
        currentChatWay: true,
        currentChatWay: 1, //1文本，2语音，3媒体
        wxSdk: wxSdk?wxSdk():{}
      }
    },
    computed: {
      myInfo() {
        return this.$store.state.myInfo
      },
    },
    methods: {
      hideMoreOption(){
        this.currentChatWay = 1
      },
      async getAudioFilPath(res){
        let { data,code,msg } = await axios('post', 'getWxMedia', {mediaId:res.serverId})
        alert(data.detailUrl)
        if(data && data.detailUrl){
          this.sendCustomMsg({
            fileDataLocalPath: '',
            fileDataUrl: data.detailUrl,
            voiceDuration: '',
            messageContentType: 2,
            textContent: ''
          })
        }else{
          this.$vux.alert.show({
            title: msg
          })
        }
      },
      goAlbum(e) {
        // var evt = document.createEvent("MouseEvents");
        // evt.initEvent("click", false, false);
        // e.target.previousSibling.dispatchEvent(evt);
        if(e === 1){
          this.wxSdk.img.choose().then((severIds)=>{
 
          })
        }
      },
      // 解决输入法被激活时 底部输入框被遮住问题
      focusIpt() {
        this.currentChatWay = 1
        var interval = setInterval(function() {
          document.body.scrollTop = document.body.scrollHeight
        }, 100)
      },
      sendTextMsg(e) {
        if (/^\s*$/.test(this.msgToSent)) {
          this.$vux.alert.show({
            title: '请不要发送空消息'
          })
          return
        } else if (this.msgToSent.length > 800) {
          this.$vux.alert.show({
            title: '请不要超过800个字'
          })
          return
        }
        this.msgToSent = this.msgToSent.trim()
        this.sendCustomMsg({
          fileDataLocalPath: '',
          fileDataUrl: '',
          voiceDuration: '',
          messageContentType: 1,
          textContent: this.msgToSent
        })
        this.msgToSent = ''
      },
      getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
          url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file);
        }
        return url;
      },
      async dataChange(e) {
        let fileType = 1
        let target = e.target
        let fileDataLocalPath = this.getObjectURL(target.files[0])
        let targetType = target.files[0].type
        if (targetType.indexOf('image/') >= 0) {
          fileType = 3
        } else if (targetType.indexOf('video/') >= 0) {
          fileType = 9
        } else if (targetType.indexOf('audio/') >= 0) {
          fileType = 2
        }
        let dataFile = new FormData()
        dataFile.append('file', target.files[0])
        dataFile.append('fileType', fileType)
        this.$store.dispatch('showLoading')
        let {
          data,
          code,
          msg
        } = await axios('post', 'fileUpload', dataFile, {
          "Content-Type": 'mutipart/form-data'
        })
        if (code === 0) {
          this.sendCustomMsg({
            fileDataLocalPath: '',
            fileDataUrl: data.audioPath,
            voiceDuration: '',
            messageContentType: fileType,
            textContent: ''
          })
        } else {
          this.$vux.alert.show({
            title: msg
          })
        }
        this.$store.dispatch('hideLoading')
      },
      sendFileMsg(e) {
        this.dataChange(e)
      },
      onInputFocus(e) {
        setTimeout(() => {
          // todo fixme 解决iOS输入框被遮挡问题，但会存在空白缝隙
          e.target.scrollIntoView()
          pageUtil.scrollChatListDown()
        }, 200)
      },
      sendCustomMsg(option) {
        this.$store.dispatch('sendMsg', {
          type: 'custom',
          scene: this.scene,
          to: this.to,
          content: {
            type: 1,
            data: {
              chatType: 1, //1单聊，2群聊
              fromUserAvatarUrl: this.myInfo.userAvatar, //发送者的头像路径
              fromUserChatID: this.myInfo.userAccid, //发送者的ACCID
              fromUserGender: 0, //0男，1女
              fromUserID: this.myInfo.id, //发送者ID
              fromUserName: this.myInfo.userName, //发送者姓名
              fromUserType: 2, //1医生，2患者，4群组，5工作室交流群，6工作室
              mediaContent: {
                fileDataLocalPath: option.fileDataLocalPath,
                fileDataUrl: option.fileDataUrl,
                voiceDuration: option.voiceDuration
              },
              messageContentType: option.messageContentType, //1文本，2语音，3图片，4提示内容，5分享内容，6预约内容，7随访内容
              messageID: "7631E1B8-67F5-4160-B5CD-CCE2C082F75B", //NIM中的messageId 
              remark: "", //消息内容备注
              sendPlatform: "iOS 9.3.2", //发送消息的平台信息
              sendTimestamp: "", //消息发送时间
              sessionHKID: '713601155233484800', //会话对象在库中的ID
              sessionID: 'd715376476484014080', //会话对象的ACCID
              sessionName: "You are", //会话对象的名称
              sessionType: 1, //1医患，2医生间，4群聊
              textContent: option.textContent //消息的文本内容
            }
          }
        })
        this.$emit('isSendMsg')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .m-chat-robot {
    overflow-y: scroll;
    .weui-cells {
      .weui-cell__hd {
        margin-right: 0.5rem;
      }
    }
  }
  .u-editor-send.u-editor-receipt {
    background-color: #fefefe;
    border: #ccc solid 1px;
    color: black;
    padding: 1.6px;
    margin-left: 1.6px;
  }
  .m-chat-editor
    background-color #ffffff
    // padding 30px
</style>