/*! 订单列表页面 */
var orderAction = {
  mobileValue:"",
  init: function(){
    orderAction.mobileValue = localStorage.getItem('mobilePhone');
    setCookie('token',localStorage.getItem('token'));  //设置token

    //判断用户是否已登陆
    if(orderAction.mobileValue != null && orderAction.mobileValue != undefined && orderAction.mobileValue != "" && orderAction.mobileValue != "null"){
      scrollFresh($(".order-box ul"),"orderlist",huiguPostUrl.getQueryOrder,10);
      pullUp($(".order-box"));
    }else{
      //调用授权接口
      Authorized(function(data){
        if(data.data.isBindAccount == true){
          if(data.data.isSubscribe == true){
            orderAction.mobileValue = data.data.mobilePhone;
            scrollFresh($(".order-box ul"),"orderlist",huiguPostUrl.getQueryOrder,10);
          }else{
            window.location.href= dataPath.WXhttpPathch + 'build/pages/card/follow.html'; //关注公众账号
          }
          
        }
      },2) 
    }
  }
};

orderAction.init();