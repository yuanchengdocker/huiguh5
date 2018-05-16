<template>
  <div class="m-chat-editor">
    <div class="m-chat-editor-main" :class="{robot:isRobot}">
      <span class="u-editor-input">
            <textarea v-model="msgToSent" @focus='onInputFocus'></textarea>
          </span>
      <span class="u-editor-icons">
            <span class="u-editor-icon" @change="sendFileMsg">
              <i class="u-icon-img"><img :src="icon2"></i>
              <input type="file" ref="fileToSent">
            </span>
      <span class="u-editor-send" @click="sendTextMsg">发 送</span>
      </span>
    </div>
  </div>
</template>

<script>
  // import ChatEmoji from './ChatEmoji'
  import util from '../../utils'
  import config from '../../config/nim.config.js'
  import pageUtil from '../../utils/page'
  import axios from '../../service/service'
  import {
    Duplex
  } from 'stream';
  // import '../../style/test.styl'
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
      continueRobotAccid(curVal, oldVal) {
        if (curVal && this.robotInfos[curVal]) {
          this.msgToSent = `@${this.robotInfos[curVal].nick} `
        }
        // 重置
        this.$store.dispatch('continueRobotMsg', '')
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
        icon1: `${config.resourceUrl}/im/chat-editor-1.png`,
        icon2: `${config.resourceUrl}/im/chat-editor-2.png`,
        icon3: `${config.resourceUrl}/im/chat-editor-3.png`,
      }
    },
    computed: {},
    methods: {
      sendTextMsg() {
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
        if (this.type === 'session') {
          let robotAccid = ''
          let robotText = ''
          let atUsers = this.msgToSent.match(/@[^\s@$]+/g)
          if (atUsers) {
            for (let i = 0; i < atUsers.length; i++) {
              let item = atUsers[i].replace('@', '')
              if (this.robotInfosByNick[item]) {
                robotAccid = this.robotInfosByNick[item].account
                robotText = (this.msgToSent + '').replace(atUsers[i], '').trim()
                break
              }
            }
          }
          this.sendCustomMsg({
            fileDataLocalPath: '',
            fileDataUrl: '',
            voiceDuration: '',
            messageContentType: 1,
            textContent: this.msgToSent
          })
        }
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
        }else{
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
              fromUserAvatarUrl: "http://fystorage1.szyyky.com/group1/M00/00/0C/CgAAqVl4m1uACVteAAA10I9o_7g402.jpg", //发送者的头像路径
              fromUserChatID: 'd715622801557426176', //发送者的ACCID
              fromUserGender: 1, //0男，1女
              fromUserID: '715622742728118272', //发送者ID
              fromUserName: "\U6797\U68ee", //发送者姓名
              fromUserType: 1, //1医生，2患者，4群组，5工作室交流群，6工作室
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
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '../../style/test.styl'
  .robot.m-chat-editor-main {
    /*.u-editor-input {
          padding-right: 4.5rem;
        }
        .u-editor-icons {
          width: 4rem;
        }*/
  }
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
    padding: 0.1rem;
    margin-left: .1rem;
  }
  .m-chat-editor
    background-color #ffffff
</style>