var cookieObj = window.cookieObj;
wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: 'wxf5bdc71fe3151bc4', // 必填，公众号的唯一标识
    timestamp: cookieObj.timestamp, // 必填，生成签名的时间戳
    nonceStr: cookieObj.noncestr, // 必填，生成签名的随机串
    signature: cookieObj.signature,// 必填，签名，见附录1
    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
});
wx.ready(function(){
	//朋友圈
	wx.onMenuShareTimeline({
	    title:sTitle, // 分享标题
	    link:sLink, // 分享链接
	    desc:sDesc,
	    imgUrl:imgUrl, // 分享图标
	    trigger: function (res) {
        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
        //alert('用户点击发送给朋友圈');
      },
	    success: function () { 
	        // 用户确认分享后执行的回调函数
	    },
	    cancel: function () { 
	        // 用户取消分享后执行的回调函数
	    },
	    fail: function (res) {
        //alert(JSON.stringify(res));
      }
	});
	//朋友
	wx.onMenuShareAppMessage({
	    title:sTitle, // 分享标题
	    link:sLink, // 分享链接
	    desc:sDesc,
	    imgUrl:imgUrl, // 分享图标
	    type: '', // 分享类型,music、video或link，不填默认为link
	    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
	    trigger: function (res) {
        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
        //alert('用户点击发送给朋友');
      },
	    success: function () { 
	        // 用户确认分享后执行的回调函数
	    },
	    cancel: function () { 
	        // 用户取消分享后执行的回调函数
	    },
	    fail: function (res) {
        //alert(JSON.stringify(res));
      }
	});
	//qq
	wx.onMenuShareQQ({
	    title:sTitle, // 分享标题
	    desc:sDesc, // 分享描述
	    link:sLink, // 分享链接
	    imgUrl:imgUrl, // 分享图标
	    success: function () { 
	       // 用户确认分享后执行的回调函数
	    },
	    cancel: function () { 
	       // 用户取消分享后执行的回调函数
	    }
	});
	//weibo
	wx.onMenuShareWeibo({
	    title:sTitle, // 分享标题
	    desc:sDesc, // 分享描述
	    link:sLink, // 分享链接
	    imgUrl:imgUrl, // 分享图标
	    success: function () { 
	       // 用户确认分享后执行的回调函数
	    },
	    cancel: function () { 
	        // 用户取消分享后执行的回调函数
	    }
	});
});