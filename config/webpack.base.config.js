const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
// const postcss = require('postcss')

const isDev = process.env.NODE_ENV === 'development' ? true : false;

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    mode: process.env.NODE_ENV,
    devtool: process.env.NODE_ENV === 'development' ? '#cheap-module-eval-source-map' : 'none',
    output: {
        filename: isDev ? 'js/[name].[hash:8].js' : 'js/bunld.[chunkhash:8].js',
        publicPath: '/build/vuepage/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: [/node-modules/,/NIM_Web_SDK.*\.js/],
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: { importLoaders: 1 }
                        },
                        'postcss-loader'
                    ]
                }),
                include: [resolve('app/style')]
            },
            // {
            //     test: /\.css$/,
            //     use: [
            //         'style-loader',
            //         {
            //             loader: 'css-loader',
            //             options: { importLoaders: 1 }
            //         },
            //         {
            //             loader: "postcss-loader",
            //             // options: {
            //             //     plugins: [
            //             //         require('autoprefixer'),
            //             //         require('postcss-import')
            //             //     ]
            //             // }
            //         }
            //     ],
            //     include: [resolve('app/style')]
            // },
            {
                test: /\.styl$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'vue-style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        // {
                        //     loader: 'postcss-loader',
                        //     options: {
                        //         sourceMap: true
                        //     }
                        // },
                        'stylus-loader'
                    ]
                })
            },
            {
                test: /\.(eot|woff|woff2|ttf)([\?]?.*)$/,
                loader: 'file-loader',
                options: {
                    name: 'font/[name]-[hash].[ext]'
                }
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                loader: 'url-loader',
                query: {
                    // limit for base64 inlining in bytes
                    limit: 4096,
                    name: 'img/[name].[ext]?[hash]'
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: isDev ? "'development'" : "'production'"
            }
        }),
        new ExtractTextPlugin({
            filename: 'style.[contenthash:8].css',
            // allChunks: true  //会导致console报错call undefined
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                        require("autoprefixer")({
                            browsers: ['ie>=8','>1% in CN']
                        })
                ]
            }
        })
    ]
}