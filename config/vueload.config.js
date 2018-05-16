module.exports = (isDev) => {
    return {
      preserveWhitespace: true,
      extractCSS: !isDev, // 针对vue文件的css文件加载入style.css中
      hotReload: isDev, // 是否开启热重载
      cssModules: {
        localIdentName: isDev ? '[path][name]---[local]---[hash:base64:5]' : '[hash:base64:5]', // 针对css进行模块化管理，可以重设置name
        camelCase: true // css命名时候，中间会用-横杆拼接，设置该参数后 名字直接用驼峰获取
      },
      
      // autoprefixer: false,
      // postcss: [
      //   require('precss')(),
      //   require('postcss-cssnext')({
      //     browsers: ['Android >= 4', 'iOS >= 7', 'Chrome >= 10', 'Firefox >= 10', 'IE >= 10']
      //   }),
      //   // require('postcss-px2rem')({
      //   //   rootValue: 75,
      //   //   mediaQuery: true,
      //   // })
      // ]
    }
  }
  