<template>
    <div class="chat-fullscreen" :class="{active:showImg}"  v-touch:swipedown="hideFullscreenVideo"  @click.stop="test">
        <div class="chat-mask"></div>
        <div class="chat-video" ref="chatImg">
        </div>
        <div @click.stop="hideFullscreenVideo" style="display:inline-block;position:absolute">
            <x-icon type="ios-close-empty" size="50"></x-icon>
        </div>
    </div>
</template>

<script type="text/javascript">
    export default {
        watch: {
            isFullscreenVideoShow(val, oldVal) {
                var self = this
                let chatImg = this.$refs.chatImg
                if (val === true) {
                    self.showImg = val
                    chatImg.innerHTML = ''
                    let img = new Image()
                    img.src = this.$store.state.fullscreenVideo.cover
                    img.alt = '图片尺寸较大，正在加载中...'
                    img.onload = function() {
                        // chatImg.appendChild(img)
                        let videoHtml = `<video controls preload="auto" autoplay 
                            width="100%" height="100%" x5-video-player-type="h5" x5-video-player-fullscreen="true" 
                            playsinline="true" webkit-playsinline="true" x-webkit-airplay="true">
                                    <source src="${self.$store.state.fullscreenVideo.src}">
                            </video>`
                        var objE = document.createElement("div"); 
                        objE.setAttribute('class','videoC')
　　                    objE.innerHTML = videoHtml; 
                        chatImg.appendChild(objE)
                        self.showImg = val
                        let video = objE.children[0]
                        self.video = video
                        self.musicInWeixinHandler(video)
                    }
                } else {
                    self.showImg = false
                    chatImg.innerHTML = ''
                }
            }
        },
        data() {
            return {
                showImg: false,
                video:null
            }
        },
        computed: {
            isFullscreenVideoShow() {
                return this.$store.state.isFullscreenVideoShow
            }
        },
        methods: {
            test(){
                alert(this.video)
                if(this.video){
                    alert(89)
                    video.play()
                }
            },
            hideFullscreenVideo() {
                this.$store.dispatch('hideFullscreenVideo')
            },
            musicInWeixinHandler(video) { 
                wx.config({
                    // 配置信息, 即使不正确也能使用 wx.ready
                    debug: false,
                    appId: '',
                    timestamp: 1,
                    nonceStr: '',
                    signature: '',
                    jsApiList: []
                });
                wx.ready(function() {
                    alert(123)
                    video.play();  
                });
            }
        }
    }
</script>

<style type="text/css">
    .vux-x-icon {
        fill: #ffffff;
        position: absolute;
    }
    .chat-fullscreen {
        position: absolute;
        height: 100%;
        width: 100%;
        overflow: hidden;
        visibility: hidden;
        z-index: 98;
        &.active {
            visibility: visible;
            .chat-mask {
                opacity: 0.7;
            }
            .chat-video {
                transform: scale3d(1, 1, 1);
            }
        }
        
    }
    .chat-mask,
    .chat-video {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        transition: all 0.5s;
        .videoC {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        img {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
    .chat-mask {
        left: 0;
        top: 0;
        background-color: #000;
        opacity: 0;
    }
</style>