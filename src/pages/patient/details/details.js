/*! 订单列表页面 */
var time,h,m,s,timerget;
$(function(){
  huiguPost(function(data){
    if(data.code == 0){
      $(".opera-box").html(_.template($("#opera_order").html()) (data.data));
      
      var $operaMain = $(".opera-defrayal-main");
      var $operaPay = $(".opera-defrayal-pay");

      if(data.data.appointStatus == 2 || data.data.appointStatus == 3){
        Timerun(data.data.remainingTime) //开始倒计时

        //判断是否从支付宝之后回调过来的页面
        var url = location.href;
        if (url.indexOf('AlipayWxPay') >=1) {
          $(".opera-defrayal").fadeIn(300);
          $(".opera-pay-confirm").css("display","block");
          AlipayWxPay();
        }
        // 调起支付界面
        $(".opera-payment-btn").on("click",function(){
          $(".opera-defrayal").fadeIn(300);
          $operaMain.removeClass("fadeOutDownBig");
          $operaMain.addClass("fadeInUpBig");
          $(".opera-defrayal-main li").removeClass("payActive");
          
          $operaPay.css("display","block");
          $operaPay.removeClass("fadeOutLeft");
          $(".opera-pay-ewm").css("display","none");  //关闭二维码
          
          $(".opera-defrayal-main").html(_.template($("#opera-pay").html()) (data.data));

          // 关闭支付
          $(".opera-defrayal-close").click(function(){
            $(".opera-defrayal").fadeOut(300);
            clearInterval(timerget);    //清除定时器
            $operaMain.removeClass("fadeInUpBig");
            $operaMain.addClass("fadeOutDownBig");
            $(".opera-defrayal-main li").removeClass("payActive");

            $(".opera-defrayal-return").css("display","none"); //返回支付页面
          })

          // 点击支付操作
          $(".opera-defrayal-pay").on("click","li",function(){
            var t = this;
            var tClass = this.className;
            if(tClass == "payWx"){ //调用微信支付
              console.log(1); 
              $(".opera-defrayal-main li").removeClass("payActive");
              t.className = tClass + " payActive";

              //调起微信支付  判断支付记录的ID
              if(data.data.appointStatus == 2){
                setTimeout(payBtn(data.data.depositId,1),500);
              }else if(data.data.appointStatus == 3){
                setTimeout(payBtn(data.data.retainageId,1),500);
              }

            }else if(tClass == "payZfb"){ //调用支付宝支付
              console.log(2);
              $(".opera-defrayal-main li").removeClass("payActive");
              t.className = tClass + " payActive";

              //调起微信支付  判断支付记录的ID
              if(data.data.appointStatus == 2){
                setTimeout(payBtn(data.data.depositId,2),500);
              }else if(data.data.appointStatus == 3){
                setTimeout(payBtn(data.data.retainageId,2),500);
              }

            }else if(tClass == "payEwm"){  //调用二维码
              console.log(3);
              $(".opera-defrayal-main li").removeClass("payActive");
              t.className = tClass + " payActive";

              //调起二维码支付  判断支付记录的ID
              if(data.data.appointStatus == 2){
                setTimeout(payEum(data.data.depositId),500);
              }else if(data.data.appointStatus == 3){
                setTimeout(payEum(data.data.retainageId),500);
              }

            }
          })
          
          //回到支付页面
          $(".opera-defrayal-return").click(function(){
            $(".opera-defrayal-pay").css("display","block");
            $(".opera-defrayal-pay").removeClass("fadeOutLeft");
            $(".opera-pay-ewm").css("display","none");

            $(".opera-defrayal-return").css("display","none"); //返回支付页面
            $(".opera-defrayal-main li").removeClass("payActive");

            clearInterval(timerget);    //清除定时器
          });

        })
      }
    }else if(data.indexOf('10016')){
      setToast3("您需要重新登录");
      deleteCookie("token"); //清除token
      localClear(5);  //清除localStorage


      window.location.href= dataPath.WXhttpPathch + 'build/pages/login.html?source=3';
    }
  },huiguPostUrl.getDetail,{"appointmentId":$.getUrlParam('appointmentId')});

//二维码支付
function payEum(id){
  var orderId = id;
  $(".opera-defrayal-pay").addClass("fadeOutLeft");
  $(".opera-defrayal-pay").css("display","none");
  $(".opera-pay-ewm").css("display","block");

  $(".opera-defrayal-return").css("display","block"); //返回支付页面
  $(".ewm").attr("src",huiguPostUrl.getQRCodeMessage + '?orderId=' + orderId);
  
  //开启二维码定时器
  timerget = setInterval(function(){    //开启定时器
         timeGet(orderId);
  },1500);   

}

function timeGet(orderId){
  huiguPost(function(data){
    if(data.code == 0){
      if(data.data.status == "3"){
        setToast3("支付成功");
        clearInterval(timerget);    //清除定时器
        $(".opera-pay-loading").css("display","block");
        setTimeout(function(){
          window.location.reload();
          $(".opera-pay-loading").css("display","none");
          $(".opera-defrayal").fadeOut();
        },4000);
      }
    }
  },huiguPostUrl.getOrderStatus,{"orderId":orderId}); 
}
//微信以及支付宝支付
function payBtn(id,type){
  var orderId = id;
  if(type == 1){
    huiguPost(function(data){
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
          //alert(res.err_msg);
          if (res.err_msg == 'get_brand_wcpay_request:ok') {
              alert("支付成功！");
              // alert(data[0].sendUrl);
              // window.location.href = data[0].sendUrl;
              $(".opera-defrayal-main ").fadeOut(300);  //支付弹窗关闭
              $(".opera-defrayal-main li").removeClass("payActive"); //支付按钮取消

              $(".opera-pay-loading").css("display","block");
              setTimeout(function(){
                location.reload();
                $(".opera-pay-loading").css("display","none");
                $(".opera-defrayal").fadeOut();
              },4000);
          } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
              alert("您已手动取消该订单支付。");
              $(".opera-defrayal").fadeOut();
          } else {
              alert("订单支付失败。");
              $(".opera-defrayal").fadeOut();
          }
      });
    },huiguPostUrl.getWechatJSAPIPay,{"orderId":orderId,"openId":localStorage.getItem('openid')});
  }else if(type == 2){
    //判断是否在微信APP里面
    var isWechat = (/MicroMessenger/ig).test(navigator.userAgent);
    // var isAliWAP = (/AlipayClient/ig).test(navigator.userAgent)
    //调起支付宝APP
      if(isWechat){
        window.location.href = dataPath.WXhttpPathch + 'build/pages/patient/details/AlipayWxPay.html?orderId='+ orderId +'&appointmentId='+ $.getUrlParam('appointmentId');

        // $(".opera-defrayal-main ").fadeOut(300);  //支付弹窗关闭
        // $(".opera-defrayal-main li").removeClass("payActive"); //支付按钮取消

        // $(".opera-pay-confirm").css("display","block");
        // AlipayWxPay();
      }else{
        huiguPost(function(data){
          window.location.href = data;
        },huiguPostUrl.getAliWAPPay,{"orderId":$.getUrlParam('orderId')});
      }
  }
}
//支付宝确认是否支付
function AlipayWxPay(){
  $(".opera-pay-confirm").on("click","a",function(){
    var t = this;
    var tClass = this.className;
    if(tClass == "quit"){
      $(".opera-defrayal").fadeOut(300);
      $(".opera-pay-confirm").css("display","none");
    }else if(tClass == "cancel"){
      $(".opera-pay-confirm").css("display","none");
      $(".opera-pay-loading").css("display","block");

      setTimeout(function(){
        location.reload();
        $(".opera-pay-loading").css("display","none");
        $(".opera-defrayal").fadeOut();
      },5000);
    }
  })
}

//倒计时
function Timerun(time){
    h = parseInt(time / (1000 * 60 * 60));; //计算剩余的小时 
    m = parseInt((time % (1000 * 60 * 60)) / (1000 * 60)) //计算剩余的分钟 
    s = (time % (1000 * 60)) / 1000; //计算剩余的秒
    
    //点击开始倒计时
    time=setInterval("run()",1000);
}

})
//进行倒计时显示
function run(){
  --s;
  if(s<0){
      --m;
      s=59;
  }
  if(m<0){
      --h;
      m=59
  }
  if(h<0){
      s=0;
      m=0;
      h=0;
      //不能调起支付按钮
      $(".opera-payment").css("display","none");
  }
  $('.opera-payment-count span').html(checkTime(h) + ':' + checkTime(m));
}
function checkTime(i){ //将0-9的数字前面加上0，例1变为01 
   if(i<10) 
   { 
    i = "0" + i; 
   } 
   return i; 
  } 