import config from '../config/nim.config.js'
import urls from '../config/urls'
import Utils from './index';

function wxSdkInit(){
    return new Promise((resolveF)=>{
        (new Promise((resolve)=>{
            var star = encodeURIComponent(location.href.split('#')[0]);
            let wxscript = document.createElement('script')
            let callbackFn = 'wxInput'
            let noncestr = Utils.getUuid()
            let timestamp = (new Date()).getTime()
            wxscript.src = urls['getSignature']+'?appId='+config.appId+'&noncestr='+noncestr+'&timestamp='+timestamp+'&callback='+callbackFn+'&url='+ star;
            document.body.appendChild(wxscript)
            window[callbackFn]=function(obj) {
                window.cookieObj = obj;
                resolve(window.cookieObj)
                document.body.removeChild(wxscript)
            }
        })).then((cookieObj)=>{
            if(wx){
                alert(JSON.stringify(cookieObj))
                wx.config({
                    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: config.appId, // 必填，公众号的唯一标识
                    timestamp: cookieObj.timestamp, // 必填，生成签名的时间戳
                    nonceStr: cookieObj.noncestr, // 必填，生成签名的随机串
                    signature: cookieObj.signature,// 必填，签名，见附录1
                    jsApiList: ['startRecord', 'stopRecord','playVoice','translateVoice','stopVoice','onVoicePlayEnd','onVoiceRecordEnd','uploadVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            }
            resolveF(buildSdk())
        })

    })
}
// ,'chooseImage','previewImage','uploadImage'
function buildSdk(){
    return {
        isWx: !!wx && window.cookieObj,
        audio:{
            playAudio: function(localId){
                wx.ready(function() {
                    wx.playVoice({
                        localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
                    });
                    wx.translateVoice({
                        localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
                        isShowProgressTips: 1, // 默认为1，显示进度提示
                        success: function (res) {
                        }
                    });
                })
            },
            stopAudio: function(localId){
                wx.ready(function() {
                    wx.stopVoice({
                        localId: localId // 需要停止的音频的本地ID，由stopRecord接口获得
                    });
                })
            },
            onVoicePlayEnd: function(callback){
                wx.ready(function() {
                    wx.onVoicePlayEnd({
                        success: function (res) {
                            callback&&callback()
                        }
                    });
                })
            },
            start: function(){
                return new Promise((resolve,reject)=>{
                    wx.ready(function() {
                        wx.startRecord({
                            success: function(res) {    
                            },
                            fail: function(res) {     //录音失败
                                alert(JSON.stringify(res))
                            }
                        })
                        wx.onVoiceRecordEnd({
                            // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                            complete: function (res) {
                                var localId = res.localId;
                                wx.uploadVoice({
                                    localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                                    isShowProgressTips: 1, // 默认为1，显示进度提示
                                    success: function (res) {
                                        resolve({localId,res})
                                    },
                                    fail: function(res){
                                        alert('shibai'+JSON.stringify(res))
                                    }
                                });
                            }
                        });
                    })
                })
            },
            stop:function(){
                return new Promise((resolve,reject)=>{
                    wx.stopRecord({
                        success: function (res) {
                            var localId = res.localId;
                            alert(res.localId)
                            wx.uploadVoice({
                                localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                                isShowProgressTips: 1, // 默认为1，显示进度提示
                                success: function (res) {
                                    resolve({localId,res})
                                },
                                fail: function(res){
                                    alert('shibai'+JSON.stringify(res))
                                }
                            });
                        },
                        fail: function(res) {
                            alert(JSON.stringify(res))
                            reject(res)
                        }
                    })
                })
            }
        },
        // img: {
        //     choose:function(){
        //         let that = this
        //         return new Promise((resolve,reject)=>{
        //             wx.chooseImage({
        //                 count: 9, // 默认9
        //                 sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        //                 sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
        //                 success: function (res) {
        //                     var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        //                     that.pushAllImg(localIds).then((serverIds)=>{
        //                         resolve(serverIds)
        //                     })
        //                 }
        //             });
        //         })
        //     },
        //     pushAllImg(localIds){
        //         var serverIds = []
        //         let promise = Promise.resolve()
        //         localIds.forEach((localId)=>{
        //             promise = promise.then(()=>{
        //                 return new Promise((resolve)=>{
        //                     wx.uploadImage({
        //                         localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
        //                         isShowProgressTips: 1, // 默认为1，显示进度提示
        //                         success: function (res) {
        //                             serverIds.push(res.serverId); // 返回图片的服务器端ID
        //                             resolve(serverIds.toString())
        //                         }
        //                     });
        //                 })
        //             })
        //         })
        //         return promise
        //     },
        //     preview:function(urls){
        //         wx.previewImage({
        //             current: urls[0], // 当前显示图片的http链接
        //             urls: urls // 需要预览的图片http链接列表
        //         });
        //     },
    
        // }
    }
}

export default {
    wxInit: wxSdkInit,
}