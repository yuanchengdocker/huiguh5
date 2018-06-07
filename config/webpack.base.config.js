const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const postcss = require('postcss')

const isDev = process.env.NODE_ENV === 'development' ? true : false;

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    // mode: process.env.NODE_ENV,
    devtool: isDev ? 'source-map' : 'none',
    output: {
        filename: isDev ? 'js/[name].[hash:8].js' : 'js/[name].[chunkhash:8].js',
        publicPath: '/build/vuepage/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                },
                exclude: [/node-modules/, /NIM_Web_SDK.*\.js/],
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
                    ],
                }),
                include: [resolve('app/style')]
            },
            {
                test: /\.styl$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    },
                                {
                    loader: 'px2rem-loader',
                    options: {
                        baseDpr: 2,             // base device pixel ratio (default: 2)
                        threeVersion: false,    // whether to generate @1x, @2x and @3x version (default: false)
                        remVersion: true,       // whether to generate rem version (default: true)
                        remUnit: 75,            // rem unit value (default: 75)
                        remPrecision: 6  
                    }
                },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    'stylus-loader'
                ]
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
                    // limit: 4096,
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
            allChunks: true  //会导致console报错call undefined
        }),
        // new MiniCssExtractPlugin({
        //     // Options similar to the same options in webpackOptions.output
        //     // both options are optional
        //     filename: "[name].[contenthash:8].css",
        //     chunkFilename: "[id].[contenthash:8].css"
        // }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    require("autoprefixer")({
                        browsers: ['ie>=8', '>1% in CN']
                    })
                ]
            }
        })
    ]
}