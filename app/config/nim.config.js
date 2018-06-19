let config = {
    sdk: 'NIM_Web_SDK_v5.0.0',
    // 用户自定义的登录注册地址
    loginUrl: '/build/vuepage/menu/self',
  
    // 资源路径根目录，为了方便用户部署在二级以上URL路径上
    resourceUrl: 'http://yx-web.nos.netease.com/webdoc/h5',
    // 用户logo地址
    logo: 'http://yx-web.nos.netease.com/webdoc/h5/im/logo.png',
    // 默认用户头像
    defaultUserIcon: 'http://yx-web.nos.netease.com/webdoc/h5/im/default-icon.png',
    // 默认普通群头像
    defaultGroupIcon: 'http://yx-web.nos.netease.com/webdoc/h5/im/default-group.png',
    // 默认高级群头像
    defaultAdvancedIcon: 'http://yx-web.nos.netease.com/webdoc/h5/im/default-advanced.png',
    // 系统通知图标
    noticeIcon: 'http://yx-web.nos.netease.com/webdoc/h5/im/notice-icon.png',
    // 我的手机图标
    myPhoneIcon: 'http://yx-web.nos.netease.com/webdoc/h5/im/my-phone.png',
    // 本地消息显示数量，会影响性能
    localMsglimit: 20
  }
  
  const env = process.env.NODE_ENV

  let appConfig = {
    // 用户的appkey
    development: {
      appkey: '45c6af3c98409b18a84451215d0bdd6e',
      // appkey: 'f192481ccf5d1f3ee1394790a99f221e',
      appId: 'wxf5bdc71fe3151bc4'
    },
    production: {
      // appkey: 'f192481ccf5d1f3ee1394790a99f221e', //测试环境
      appkey: '5aeb1f85bd69048d1f0a440dacaa68c3',//正式环境
      // appId: 'wxf5bdc71fe3151bc4', //测试环境
      appId: 'wx00d754ba950e306a' //正式环境
    }
  }
  
  config = Object.assign(config, appConfig[env])
  
  export default config
  
  
  