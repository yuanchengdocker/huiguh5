var isWechat = (/MicroMessenger/ig).test(navigator.userAgent);
var codeData = $.getUrlParam('code');

if (isWechat) {
   if(codeData == undefined || codeData == null || codeData == "" || codeData == "null"){
     top.location.href ='https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + dataPath.WXvalueApich + '&redirect_uri='+ top.location.href +'&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
   }else{
    huiguPost(function(data){
      if(data.code == 0){
        $(".pay-box").html(_.template($("#pay_order").html()) (data.data));

        $(".payBtn").on("click",function(){
          huiguPost(function(data){
            if(data.code == 0){
              //setCookie('openId',data.data.openid);
              doWechatPay(data.data.openid);
            }
          },huiguPostUrl.getWeiXinDetail,{"appId":dataPath.WXvalueApich,"authCode":$.getUrlParam('code')});
        });
      }
    },huiguPostUrl.getPayMessage,{"orderId":$.getUrlParam('orderId')});
   }
} else {
  huiguPost(function(data){
    if(data.code == 0){
      $(".pay-box").html(_.template($("#pay_order").html()) (data.data));
      $(".payBtn").on("click",function(){
        doAliPay();
      });
    }
  },huiguPostUrl.getPayMessage,{"orderId":$.getUrlParam('orderId')});
}

//二维码微信支付
function doWechatPay(openid){
  huiguPost(function(data){
      //alert(openid);
      //alert($.getUrlParam('orderId'));
      //alert(JSON.parse(JSON.parse(data).payInfo).appId);
      // alert(JSON.parse(JSON.parse(data).payInfo).timeStamp);
      // alert(JSON.parse(JSON.parse(data).payInfo).nonceStr);
      // alert(JSON.parse(JSON.parse(data).payInfo).package);
      // alert(JSON.parse(JSON.parse(data).payInfo).signType);
      // alert(JSON.parse(JSON.parse(data).payInfo).paySign);
      var content = JSON.parse(JSON.parse(data).payInfo)
      WeixinJSBridge.invoke('getBrandWCPayRequest', {
          "appId": content.appId, //公众号名称，由商户传入
          "timeStamp": content.timeStamp, //时间戳，自 1970 年以来的秒数
          "nonceStr": content.nonceStr, //随机串
          "package": content.package, //商品包信息
          "signType": content.signType, //微信签名方式:
          "paySign": content.paySign //微信签名
      }, function (res) {
          /* 对于支付结果，res对象的err_msg值主要有3种，含义如下：(当然，err_msg的值不只这3种)
           1、get_brand_wcpay_request:ok   支付成功后，微信服务器返回的值
           2、get_brand_wcpay_request:cancel   用户手动关闭支付控件，取消支付，微信服务器返回的值
           3、get_brand_wcpay_request:fail   支付失败，微信服务器返回的值
           -可以根据返回的值，来判断支付的结果。
           -注意：res对象的err_msg属性名称，是有下划线的，与chooseWXPay支付里面的errMsg是不一样的。而且，值也是不同的。
           */
          setToast3(res.err_msg);
          if (res.err_msg == 'get_brand_wcpay_request:ok') {
              setToast3("支付成功！");
              $(".payMoney .amount-name").html("已付");
              $(".payBtn").css("display","none");
              // alert(data[0].sendUrl);
              // window.location.href = data[0].sendUrl;

          } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
              setToast3("您已手动取消该订单支付。");
          } else {
              setToast3("订单支付失败。");
          }
      });
    },huiguPostUrl.getWechatJSAPIPay,{"orderId":$.getUrlParam('orderId'),"openId":openid});
}

//二维码支付宝支付
function doAliPay(){
  huiguPost(function(data){
    window.location.href = data;
    var timer = setInterval(function(){    //开启定时器
        huiguPost(function(data){
          if(data.code == 0){
            if(data.data.status == "3"){
              setToast3("支付成功");
              $(".payMoney .amount-name").html("已付");
              $(".payBtn").css("display","none");
              clearInterval(timer);    //清除定时器
            }
          }
        },huiguPostUrl.getOrderStatus,{"orderId":$.getUrlParam('orderId')});   
    },1500);    
         
  },huiguPostUrl.getAliWAPPay,{"orderId":$.getUrlParam('orderId')});
}

// function payAlipay(){
//   $("..opera-defrayal").ffadeIn(300);
//   $(".opera-pay-confirm").css("display","block");
//   AlipayWxPay();
// }

// //支付宝确认是否支付
// function AlipayWxPay(){
//   $(".opera-pay-confirm").on("click","a",function(){
//     var t = this;
//     var tClass = this.className;
//     if(tClass == "quit"){
//       $(".opera-defrayal").fadeOut(300);
//       $(".opera-pay-confirm").css("display","none");
//     }else if(tClass == "cancel"){
//       $(".opera-pay-confirm").css("display","none");
//       $(".opera-pay-loading").css("display","block");

//       setTimeout(function(){
//         OrderStatus();
//         $(".opera-pay-loading").css("display","none");
//         $(".opera-defrayal").fadeOut();
//       },5000);
//     }
//   })
// }


// function OrderStatus(){
//   huiguPost(function(data){
//     if(data.code == 0){
//       if(data.data.status == 3){
//         setToast3("支付成功！");
//         $(".payMoney .amount-name").html("已付");
//         $(".payBtn").css("display","none");
//       }
//     }
//   },huiguPostUrl.getOrderStatus,{"orderId":$.getUrlParam('orderId')});
// }