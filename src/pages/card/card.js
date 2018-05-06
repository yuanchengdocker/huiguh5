var applyAction={
  init:function(){
    $("#name").focus();
    var $btn = $("#apply-btn");
    
    $btn.attr("disabled",true); //设置按钮不可点击
  },
  changBtn: function(){
    $("#apply-btn").attr("disabled",false); //设置按钮不可点击
  },
  submit:function(){

    var identityCardData = document.getElementById("identityCard");
    var nameData = document.getElementById("name");
    var idCard = function(p){var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  return reg.test(p);}

    if(!identityCardData.value){
      setToast3("请输入身份证号！");
      identityCardData.focus();
      return;
    }
    if(!idCard(identityCardData.value)){
      setToast3("请输入有效的身份证号！");
      identityCardData.focus();
      return;
    }
    if(!nameData.value){
      setToast3("请输入姓名");
      nameData.focus();
      return;
    }

    huiguPost(function(data){
      if(data.code == 0){
        setToast3("绑定成功");
        
        var dataValue = data.data;
        //判断是否是二维码扫描进入的
        if(localStorage.getItem('doctorid') == "" || localStorage.getItem('doctorid') == null){
          window.location.href= dataPath.WXhttpPathch + 'build/pages/index.html';
        }else{
          huiguPost(function(data){
            if(data.code == 0){
              if(localStorage.getItem('isSubscribe') == "true"){
                window.location.href= dataPath.WXhttpPathch + 'build/pages/index.html';
              }else{
                window.location.href='follow.html';
              }
              
            }else{
              setToast3(data.msg);
            }
          },huiguPostUrl.getDoctorRelation,{'ofPatientId':dataValue.ofPatientId,'doctorUserId':localStorage.getItem('doctorid')})
        }
        
      }else{
        setToast3(data.msg);
      }
    },huiguPostUrl.getBindPatientMember,{"identityCard":identityCardData.value,"name":nameData.value})
  },
};

applyAction.init();
