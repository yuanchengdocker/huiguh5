export default () => {
    var cookieObj = window.cookieObj;
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wxf5bdc71fe3151bc4', // 必填，公众号的唯一标识
        timestamp: cookieObj.timestamp, // 必填，生成签名的时间戳
        nonceStr: cookieObj.noncestr, // 必填，生成签名的随机串
        signature: cookieObj.signature,// 必填，签名，见附录1
        jsApiList: ['startRecord', 'stopRecord'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    return {
        isWx: !!wx,
        audio:{
            start: function(){
                wx.startRecord({
                    success: function(res) {    
                        alert('开始录音'+JSON.stringify(res))
                    },
                    fail: function(res) {     //录音失败
                        alert('开始录音'+JSON.stringify(res))
                    }
                })
            },
            stop:function(){
                // return new Promise((resolve,reject)=>{
                    wx.stopRecord({
                        success: function (res) {
                            var localId = res.localId;
                            alert('结束录音'+JSON.stringify(res))
                            resolve(res)
                        },
                        fail: function(res) {
                            alert('结束录音'+JSON.stringify(res))
                        }
                    })
                // })
            },
            cancel:function(){
    
            }
        }
    }
}