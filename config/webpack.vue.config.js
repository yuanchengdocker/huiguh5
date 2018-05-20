const path = require('path')
const webpackMerge = require('webpack-merge')
const HtmlPlugin = require('html-webpack-plugin')
const webpackBase = require('./webpack.base.config')
const vueloaderConfig = require('./vueload.config.js')
const vuxLoader = require('vux-loader')
const webpack = require('webpack')
// const postcss = require('postcss')

const isDev = process.env.NODE_ENV === 'development' ? true : false;

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
const devServer = {
    port: '9999',
    host: 'localhost',
    // progress: true,
    // disableHostCheck: true,
    overlay: {
    },
    //   errors: true
    hot: true,
    historyApiFallback: {
        index: '/build/vuepage/index.html'
    },
    proxy: {
        '/huiguapi/*': {
            target: 'http://192.168.0.54:3362',
            // target: 'http://192.168.27.35:8082',
            secure: false, // 接受 运行在 https 上的服务
            changeOrigin: true
        },
        '/thirdpartyapi/*': {
            target: 'http://192.168.0.54:3362',
            // target: 'http://10.0.0.167:3362',
            secure: false, // 接受 运行在 https 上的服务
            changeOrigin: true
        }
    }
}
let config = webpackMerge(webpackBase, {
    entry: {
        bundle: path.join(__dirname, '../app/index.js')
    },
    output: {
        path: path.join(__dirname, '../build/vuepage'),
    },
    resolve: {
        extensions: ['.js', '.json', '.css', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.js',
            '@': resolve('src')
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueloaderConfig(isDev)
            }
        ]
    },
    plugins: [
        new HtmlPlugin({
            filename: 'index.html',
            template: './config/template.html',
            title: 'vuepage'
        })
    ]
})
if (isDev) {
    config = webpackMerge(config, {
        devServer: devServer,
        plugins: [
            //配合热替换作用
            new webpack.HotModuleReplacementPlugin()
        ]
    })
} else {
    config = webpackMerge(config, {
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: Infinity
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'runtime',
                minChunks: Infinity
            }),
            new webpack.optimize.UglifyJsPlugin()
        ]
    })
}
config = vuxLoader.merge(config, {
    plugins: [
        'vux-ui',
        'progress-bar',
        'duplicate-style'
    ]
})

module.exports = config