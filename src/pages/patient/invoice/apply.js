$(function(){
  $(".people #name").focus();
  $(".button").on("click",".btn",function(){
    var receiverMobile = document.getElementById("phone").value;
    var receiverName =document.getElementById("name").value;
    var receiverAddress = $("#adress").val();

    if(!receiverName){
      setToast3("收件人不能为空");
      return;
    }

    if(receiverMobile && /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(receiverMobile)){
    }else{
      setToast3("请输入有效的手机号码");
      $("#phone").focus();
      return false;
    }

    if(!receiverAddress){
      setToast3("地址不能为空");
      return;
    }

    huiguPost(function(data){
        if(data.code == 0){
          setToast3("提交成功");
          setTimeout(function(){
            self.location=document.referrer;
          },1000);
        }
    },huiguPostUrl.getApplyInvoice,{"appointmentMainOrderId":$.getUrlParam('orderId'),"receiverMobile":receiverMobile,"receiverName":receiverName,"receiverAddress":receiverAddress})
  })
})