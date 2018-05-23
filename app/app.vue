<template>
  <div style="height:100%;" class="g-window">
    <div v-transfer-dom>
      <loading v-model="loadingStatus"></loading>
    </div>
    <fullscreen-img></fullscreen-img>
    <fullscreen-video></fullscreen-video>
    <!-- main content -->
    <view-box ref="viewBox" :body-padding-top="'0'" body-padding-bottom="55px">
      <!-- remember to import BusPlugin in main.js if you use components: x-img and sticky -->
      <transition :name="transitionName">
        <keep-alive :include="/session/">
          <router-view class="router-view"></router-view>
        </keep-alive>
      </transition>
      <tabbar class="vux-demo-tabbar" icon-class="vux-center" v-show="showMenuBar" slot="bottom">
        <tabbar-item :link="{path:menus.chat.path}" :class="route.path === menus.chat.path?'hg-icon-select':''" :badge="sessionUnreadCount">
          <span class="hg-icon-22 hg-icon-chat" slot="icon" style="position:relative;top: -2px;">&#xe637;</span>
          <span slot="label" class="icon-title">{{menus.chat.name}}</span>
        </tabbar-item>
        <tabbar-item :link="{path:menus.article.path}" :class="route.path === menus.article.path?'hg-icon-select':''">
          <span class="hg-icon-22 hg-icon-article" slot="icon">&#xe633;</span>
          <span slot="label" class="icon-title">{{menus.article.name}}</span>
        </tabbar-item>
        <tabbar-item :link="{path:menus.self.path}" :class="route.path === menus.self.path?'hg-icon-select':''">
          <span class="hg-icon-22 hg-icon-self" slot="icon">&#xe633;</span>
          <span slot="label" class="icon-title">{{menus.self.name}}</span>
        </tabbar-item>
      </tabbar>
    </view-box>
  </div>
</template>

<script>
  const sessionHistory = window.sessionStorage
  import FullscreenImg from './views/components/FullscreenImg'
  import FullscreenVideo from './views/components/FullscreenVideo'
  import './style/stylus/main.styl'
  import {
    setTimeout
  } from 'timers';
  import {
    mapActions,
    mapState,
    mapGetters
  } from 'vuex'
  import cookie from './utils/cookie'
  import pageUtil from './utils/page'
  export default {
    components: {
      FullscreenImg,
      FullscreenVideo
    },
    methods: {
      ...mapActions(['updatedLoadingStatus'])
    },
    beforeCreate(){
      // debugger
      this.$store.dispatch('openDB')
      this.$store.dispatch('connect')
      // this.$store.dispatch('updateRefreshState')
    },
    created() {
      this.updatedLoadingStatus({
        status: true
      })
    },
    mounted() {
      // 提交sdk连接请求
      // this.$store.dispatch('connect')
      // // this.$store.dispatch('updateRefreshState')
      // this.$store.dispatch('openDB')
      this.updatedLoadingStatus({
        status: false
      })
    },
    beforeDestroy() {
      this.box && this.box.removeEventListener('scroll', this.handler, false)
    },
    watch: {
      // 更新页面所在位置，用于判断是前进页还是后退页
      '$route' (to, from) {
        if (to && from) {
          let toPath = to.path
          let fromPath = from.path
          if(toPath.indexOf('/build/vuepage/chat') >= 0){
            this.transitionName = 'forward'
            return
          }
          if(toPath.indexOf('/build/vuepage/session') >= 0 
            && fromPath.indexOf('/build/vuepage/chat') >= 0){
              this.transitionName = 'backward'
              return
          }
          this.transitionName = ''
        }
      },
      showToastMsg(curValue){
        this.$toast(curValue)
      }
    },
    computed: {
      ...mapState({
        loadingStatus: state => state.loadingStatus,
        showMenuBar: state => state.showMenuBar,
        route: state => state.route,
        showToastMsg: state => state.showToastMsg
      }),
      ...mapGetters(['sessionUnreadCount'])
    },
    data() {
      return {
        menus: {
          chat: {
            name: '咨询医生',
            path: "/build/vuepage/session"
          },
          article: {
            name: '科普文章',
            path: "/build/vuepage/article"
          },
          self: {
            name: '个人中心',
            path: "/build/vuepage/self"
          },
        },
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
    background-color: #fbf9fe;
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
  } // .weui-tabbar.vux-demo-tabbar {
  //   /** backdrop-filter: blur(10px);
  //   background-color: none;
  //   background: rgba(247, 247, 250, 0.5);**/
  // }
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
    top: 46px;
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