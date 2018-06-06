<template>
  <div class="m-chat-editor">
    <div class="component-dialogue-bar-person">
      <span class="iconfont" v-show="currentChatWay === 2" v-on:click="currentChatWay=1">
        <img src="../../img/jianpan.png" alt="">
      </span>
      <span class="iconfont" v-show="currentChatWay != 2" v-on:click="currentChatWay=2">
        <img src="../../img/audio.png" alt="">
      </span>
      <div class="chat-way" v-show="currentChatWay === 2">
        <div class="chat-say" v-press="{getAudioFilPath:getAudioFilPath,wxSdk:getSdk}">
          <span class="one">按住 说话</span>
          <span class="two">松开 结束</span>
        </div>
      </div>
      <div class="chat-way" v-show="currentChatWay != 2">
        <form action="" onsubmit="return false;" value="发送">
          <input class="chat-txt" v-model="msgToSent" type="text" @focus="focusIpt" @keyup.enter="sendTextMsg()" />
        </form>
      </div>
      <span class="more iconfont " v-on:click="currentChatWay ===3 ? currentChatWay=1 : currentChatWay =3 ">
        <img src="../../img/media.png" alt="">
      </span>
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
      <section class="option-item" @click="goAlbum"><input @change="sendFileMsg" v-show="false" type="file" accept="video/*" capture="microphone" /><img src="../../img/camera.png" />
      </section>
    </div>
  </div>
</template>

<script>
  // import ChatEmoji from './ChatEmoji'
  import util from '../../utils'
  import config from '../../config/nim.config.js'
  import {photoCompress,blobToDataURL} from '../../utils/img'
  import axios from '../../service/service'
  import "../../style/stylus/dialogue.styl"
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
      wxSdk: {
        type: Object,
        default () {
          return null
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
    mounted(){
    },
    watch: {
      currentChatWay(curVal) {
        let more = this.$refs.chatMoreOption
        if (curVal === 3) {
          document.addEventListener("click", this.hideMoreOption);
          more.addEventListener("click", (event) => {
            event = event || window.event;
            event.stopPropagation();
          });
        } else {
          document.removeEventListener('click', this.hideMoreOption)
        }
      },
      msgToSent(curVal, oldVal) {
        if (this.isRobot) {
          return
        }
        let indexAt = this.msgToSent.indexOf('@')
      }
    },
    data() {
      return {
        msgToSent: '',
        currentChatWay: true,
        currentChatWay: 1, //1文本，2语音，3媒体
      }
    },
    computed: {
      myInfo() {
        return this.$store.state.myInfo
      },
      currDoctorBind() {
        return this.$store.state.currDoctorBind
      },
    },
    methods: {
      getSdk(){
        return this.wxSdk
      },
      sendMyBuildMsg(callback,content,status){
        this.$store.dispatch('buildAndPutMsg',{callback,content,status})
      },
      sendNimMsg(msg){
        this.$store.dispatch('sendMsg',msg)
      },
      hideMoreOption() {
        this.currentChatWay = 1
      },
      getAudioFilPath(time,localId,res,isSelf) {
        if(isSelf){
          this.$store.dispatch('loadToad','录音时长最多一分钟')
        }
        var serverId = res.serverId
        this.sendMyBuildMsg((msg)=>{
          //开始发送
          this.$store.dispatch('sendAudioMsg',{serverId,msg})
        },{
          mediaContent:{
            serverId: serverId,
            fileDataLocalPath: localId,
            fileDataUrl: '',
            voiceDuration: time
          },
          messageContentType: 2,
          textContent: ''
        },'success')
      },
      goAlbum(e) {
        
        if(e === 1){
          this.wxSdk.img.choose(['album','camera']).then((files)=>{
              files&&files.map((file)=>{
                this.sendImg(file)
              })
          })
        }else if(e === 2){
          // this.wxSdk.img.choose(['camera']).then((files)=>{
          //     files&&files.map((file)=>{
          //       this.sendImg(file)
          //     })
          // })
          // this.wxSdk.video.choose().then(()=>{

          // })
        }else{
          var evt = document.createEvent("MouseEvents");
          evt.initEvent("click", false, false);
          e.target.previousSibling.dispatchEvent(evt);
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
        
        this.sendMyBuildMsg((msg)=>{
          this.sendNimMsg(msg)
          this.msgToSent = ''
        },{
          mediaContent: '',
          messageContentType: 1,
          textContent: this.msgToSent
        })

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
      dataChange(e) {
        let target = e.target
        let files = Array.from(target.files)
        files&&files.forEach((file)=>{
          ((file)=>{
            setTimeout(()=>{
              let targetType = file.type
              if (targetType.indexOf('image/') >= 0) {
                if(file.size/1024 > 1025) {
                  photoCompress(file,{quality: 0.2},(blob)=>{
                    this.sendImg(blob)
                  })
                }else{
                  this.sendImg(file)
                }
              } else if (targetType.indexOf('video/') >= 0) {
                  this.sendVideo(file)
              } 
            },0)
          })(file)
        })
        
      },
      sendVideo(file){
        let fileDataLocalPath = this.getObjectURL(file)
        this.sendMyBuildMsg((msg)=>{
            //开始发送
            this.$store.dispatch('sendVideoMsg',{file:file,msg})
          },{
            mediaContent:{ //视频
              fileDataLocalPath: fileDataLocalPath,
              fileDataUrl: '',
              coverPath: '',
              coverSize: '',
              coverUrl: '',
              displayName: '',
              duration: 0
            },
            messageContentType: 11,
            textContent: ''
          })
      },
      sendImg(file){
        blobToDataURL(file).then((localId)=>{
          let fileDataLocalPath = this.getObjectURL(file)
          let img = new Image(); //手动创建一个Image对象
          img.src = fileDataLocalPath //创建Image的对象的url
          img.onload = ()=>{
            let imgWidth = img.width
            let imgHeight = img.height
            this.sendMyBuildMsg((msg)=>{
              //开始发送
              this.$store.dispatch('sendImgMsg',{file:file,msg})
            },{
              mediaContent:{//3图片
                fileDataLocalPath: localId,
                fileDataUrl: '',
                originUrl: '',
                thumbnailUrl: '',
                pHeight: imgHeight,
                pWidth: imgWidth
              },
              messageContentType: 3,
              textContent: ''
            })
          }
        })
      },
      sendFileMsg(e) {
        this.dataChange(e)
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