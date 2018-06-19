import config from '../config/nim.config.js'
import urls from '../config/urls'
import Utils from './index';
import {convertBase64UrlToBlob,base64Compress} from './img'

function wxSdkInit(url){
    return new Promise((resolveF)=>{
        (new Promise((resolve)=>{
            if(Utils.judgeAndroidOrIos() === 'iOS'){
                url = window.starUrl
            }
            var star = encodeURIComponent(url);
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
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: config.appId, // 必填，公众号的唯一标识
                    timestamp: cookieObj.timestamp, // 必填，生成签名的时间戳
                    nonceStr: cookieObj.noncestr, // 必填，生成签名的随机串
                    signature: cookieObj.signature,// 必填，签名，见附录1
                    jsApiList: ['startRecord', 'stopRecord','playVoice','translateVoice','stopVoice','onVoicePlayEnd','onVoiceRecordEnd','uploadVoice','chooseImage','previewImage','chooseVideo','getLocalImgData'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            }
            resolveF(buildSdk())
        })

    })
}
function buildSdk(){
    return {
        isWx: !!wx && window.cookieObj,
        audio:{
            playAudio: function(localId){
                wx.ready(function() {
                    wx.playVoice({
                        localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
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
            start: function(callback){
                return new Promise((resolve,reject)=>{
                    wx.ready(function() {
                        wx.startRecord({
                            success: function(res) { 
                                callback&&callback()   
                            },
                            fail: function(res) {     //录音失败
                                alert('录音失败')
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
                                        alert('录音上传失败')
                                    }
                                });
                            }
                        });
                    })
                })
            },
            stop:function(isCancel){
                return new Promise((resolve,reject)=>{
                    wx.stopRecord({
                        success: function (res) {
                            var localId = res.localId;
                            if(!isCancel){
                                wx.uploadVoice({
                                    localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                                    isShowProgressTips: 1, // 默认为1，显示进度提示
                                    success: function (res) {
                                        resolve({localId,res})
                                    },
                                    fail: function(res){
                                        alert('语音上传失败')
                                    }
                                });
                            }
                        },
                        fail: function(res) {
                            alert('语音停止失败')
                            reject(res)
                        }
                    })
                })
            }
        },
        img: {
            choose:function(sourceType){
                let that = this
                return new Promise((resolve,reject)=>{
                    wx.chooseImage({
                        count: 9, // 默认9
                        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有
                        success: function (res) {
                            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                            try {
                                Promise.all(that.pushAllImg(localIds)).then((files)=>{
                                    resolve(files)
                                })
                            } catch (error) {
                                resolve()
                                alert(JSON.stringify(error))
                            }
                        }
                    });
                })
            },
            pushAllImg(localIds){
                var serverIds = []
                let promises = []
                localIds = Array.from(localIds)
                localIds.forEach((localId)=>{
                    let promise = new Promise((resolve)=>{
                        wx.getLocalImgData({
                            localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                            success: function (res) {
                                let localData = res.localData;
                                try {
                                    base64Compress(localData,{quality: 0.2},function(file){
                                        resolve(file)
                                    })
                                } catch (error) {
                                    alert('getLocalImgData'+JSON.stringify(error))
                                }
                            }
                        });
                    })
                    promises.push(promise)
                })
                return promises
            }
        },
        video: {
            choose:function(){
                let that = this
                return new Promise((resolve,reject)=>{
                    // alert(wx.chooseVideo)
                    // wx.chooseVideo({
                    //     success: function (res) {
                    //        alert(JSON.stringify(res))
                    //     }
                    // });
                    alert(WeixinJSBridge.invoke)
                    WeixinJSBridge.invoke('chooseVideo', {
                            sourceType : sourceType,
                            maxDuration : '8',//限制录制时间
                            camera : camera,
                            isShowProgressTips : 0
                        }, 
                        function(res) {
                            alert(JSON.stringify(res));
                            if (res.err_msg === "chooseVideo:ok") {
                                window.localId = res.localId;
                                callback();
                            }
                        }
                    );
                })
            }
        }
    }
}

export default {
    wxInit: wxSdkInit,
}