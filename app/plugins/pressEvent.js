import Vue from 'vue'

const PressEventPlugin = Object.create(null)

PressEventPlugin.install = function (Vue) {
  // 添加全局资源
  Vue.directive('press',{
    bind: function(element, binding) {
      var startTx, startTy, isCancel
      var wxSdk = binding.value.wxSdk
      var myWxSdk = null
      var recording = document.querySelector('.recording'),
          recordingVoice = document.querySelector('.recording-voice'),
          recordingCancel = document.querySelector('.recording-cancel')
      var timeCount = 1
      var time = null
      element.addEventListener('touchstart', function(e) {
        var recording = document.querySelector('.recording'),
          recordingVoice = document.querySelector('.recording-voice'),
          recordingCancel = document.querySelector('.recording-cancel')
        element.className = "chat-say say-active"
        recording.style.display = recordingVoice.style.display = "block"
        // console.log('start')
        if(!myWxSdk)
          myWxSdk = wxSdk()
        if (myWxSdk.isWx) {
          console.log('开始语音')
          timeCount = 1
          time = setInterval(()=>{
            timeCount++
          },1000)
          myWxSdk.audio.start().then(({localId,res}) => {
            element.className = "chat-say"
            recordingCancel.style.display = recording.style.display = recordingVoice.style.display = "none"
            if(time){
              clearInterval(time)
              time = null
            }
            binding.value.getAudioFilPath(timeCount,localId,res,true)
          })
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
        if (myWxSdk&&myWxSdk.isWx) {
          if (isCancel) {
            console.log('取消语音')
            timeCount = 1
            clearInterval(time)
            time = null
            myWxSdk.audio.stop()
          } else {
            myWxSdk.audio.stop().then(({localId,res}) => {
              console.log('录音结束。。。。')
              if(time){
                clearInterval(time)
                time = null
              }
              binding.value.getAudioFilPath(timeCount,localId,res)
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
        if (distanceY > 50) {
          recordingVoice.style.display = "none"
          recordingCancel.style.display = "block"
          isCancel = true
        } else {
          recordingVoice.style.display = "block"
          recordingCancel.style.display = "none"
          isCancel = false
        }
        e.preventDefault()
      }, false);
    }
  })
}

export default PressEventPlugin