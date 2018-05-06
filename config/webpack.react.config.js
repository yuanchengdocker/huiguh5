const path = require('path')
const webpackMerge = require('webpack-merge')
const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const webpackBase = require('./webpack.base.config')

const config = webpackMerge(webpackBase, {
    entry:{
        bundle: path.join(__dirname, '../client/index.js')
    },
    output:{
        path: path.join(__dirname, '../build/reactpage'),
    },
    resolve: {
        extensions: ['.jsx', '.js']
    },
    module: {
        rules:[
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlPlugin({
            filename: 'index.html',
            template: './config/template.html',
            title: 'reactpage'
        })
    ]
})

module.exports = config