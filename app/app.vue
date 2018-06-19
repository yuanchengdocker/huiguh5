<template>
  <div style="height:100%;" class="g-window">
    <div v-transfer-dom>
      <loading v-model="loadingStatus"></loading>
    </div>
    <fullscreen-img></fullscreen-img>
    <fullscreen-video></fullscreen-video>
    <!-- main content -->
    <view-box ref="viewBox" :body-padding-top="'0'" body-padding-bottom="0">
      <!-- remember to import BusPlugin in main.js if you use components: x-img and sticky -->
      <transition :name="transitionName">
        <keep-alive :include="/mmenu|chat/">
          <router-view class="router-view"></router-view>
        </keep-alive>
      </transition>

    </view-box>
  </div>
</template>

<script>
  import FullscreenImg from './views/components/FullscreenImg'
  import FullscreenVideo from './views/components/FullscreenVideo'
  import './style/stylus/main.styl'
  import {
    mapActions,
    mapState,
    mapGetters
  } from 'vuex'
  export default {
    components: {
      FullscreenImg,
      FullscreenVideo
    },
    methods: {
      ...mapActions(['updatedLoadingStatus']),
    },
    beforeCreate(){
      this.$store.dispatch('openDB',()=>{
        this.$store.dispatch('connect')
      })
    },
    created() {
    },
    mounted() {
    },
    watch: {
      // 更新页面所在位置，用于判断是前进页还是后退页
      '$route' (to, from) {
        if (to && from) {
          let toPath = to.path
          let fromPath = from.path
          this.transitionName = ''
          if(toPath.indexOf('/build/vuepage/chat') >= 0
            && fromPath.indexOf('/build/vuepage/menu/session') >= 0){
            this.transitionName = 'forward'
          }
          if(toPath.indexOf('/build/vuepage/menu/session') >= 0 
            && fromPath.indexOf('/build/vuepage/chat') >= 0){
              this.transitionName = 'backward'
          }
          if(toPath.indexOf('/build/vuepage/question') >= 0
            && fromPath.indexOf('/build/vuepage/chat') >= 0){
            this.$store.dispatch('updateChatMsgStatus',2)
            this.transitionName = 'forward'
          }
          if(toPath.indexOf('/build/vuepage/chat') >= 0 
            && fromPath.indexOf('/build/vuepage/question') >= 0){
              if(this.$store.state.isQuestionSubmit){ //问卷回复触底
                this.$store.dispatch('updateIsQuestionSubmit',false)
              }else{
                this.$store.dispatch('updateChatMsgStatus',2)
              }
              this.transitionName = 'backward'
          }
          if(toPath.indexOf('/build/vuepage/materials') >= 0
            && fromPath.indexOf('/build/vuepage/chat') >= 0){
            this.$store.dispatch('updateChatMsgStatus',2)
            this.transitionName = 'forward'
          }
          if(toPath.indexOf('/build/vuepage/chat') >= 0 
            && fromPath.indexOf('/build/vuepage/materials') >= 0){
              this.$store.dispatch('updateChatMsgStatus',2)
              this.transitionName = 'backward'
          }
        }
      },
      showToastMsg(curValue){
        if(curValue){
          this.$toast(curValue)
        }
      }
    },
    computed: {
      ...mapState({
        loadingStatus: state => state.loadingStatus,
        showToastMsg: state => state.showToastMsg
      }),
      ...mapGetters(['sessionUnreadCount'])
    },
    data() {
      return {
        transitionName: 'forward'
      }
    },
    updated() {
      this.$store.dispatch('updateMyInfor')
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/tap.less';
  body {
    background-color: #f3f3f3;
  }
  html,
  body {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }
  .demo-icon-22 {
    font-family: 'vux-demo';
    font-size: 22px;
    color: #888;
  } 
  .vux-demo-tabbar .weui-bar__item_on .demo-icon-22 {
    color: #F70968;
  }
  .vux-demo-tabbar .weui-tabbar_item.weui-bar__item_on .vux-demo-tabbar-icon-home {
    color: rgb(53, 73, 94);
  }
  .demo-icon-22:before {
    content: attr(icon);
  }
  .vux-demo-tabbar-component {
    background-color: #F70968;
    color: #fff;
    border-radius: 7px;
    padding: 0 4px;
    line-height: 14px;
  }
  .weui-tabbar__icon+.weui-tabbar__label {
    margin-top: 0!important;
  }
  .weui-tabbar__item.weui-bar__item_on .weui-tabbar__label .icon-title{
    color:#999999
  }
  .vux-demo-header-box {
    z-index: 100;
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
  }
  @font-face {
    font-family: 'vux-demo';
    /* project id 70323 */
    src: url('//at.alicdn.com/t/font_70323_wlronpvr565yiudi.eot');
    src: url('//at.alicdn.com/t/font_70323_wlronpvr565yiudi.eot?#iefix') format('embedded-opentype'), url('//at.alicdn.com/t/font_70323_wlronpvr565yiudi.woff') format('woff'), url('//at.alicdn.com/t/font_70323_wlronpvr565yiudi.ttf') format('truetype'), url('//at.alicdn.com/t/font_70323_wlronpvr565yiudi.svg#iconfont') format('svg');
  }
  .demo-icon {
    font-family: 'vux-demo';
    font-size: 20px;
    color: #04BE02;
  }
  .demo-icon-big {
    font-size: 28px;
  }
  .demo-icon:before {
    content: attr(icon);
  }
  .router-view {
    width: 100%;
    height: 100%;
  }
  .vux-pop-out-enter-active,
  .vux-pop-out-leave-active,
  .vux-pop-in-enter-active,
  .vux-pop-in-leave-active {
    will-change: transform;
    transition: all 500ms;
    height: 100%;
    top: 46px;
    position: absolute;
    backface-visibility: hidden;
    perspective: 1000;
  }
  .vux-pop-out-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .vux-pop-out-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .vux-pop-in-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .vux-pop-in-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .menu-title {
    color: #888;
  }
</style>