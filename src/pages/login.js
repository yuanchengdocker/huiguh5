/*! 这是登录页面以及登陆成功页面 */
var loginAction={
  sourcedata: "",
  openId:"",
  $btnCode: $(".login .authcode"),
  mobilePhone:"",
  captcha:"",
  validCode:"",
  init: function(){
    $("#mobilePhone").focus();
    loginAction.openId = localStorage.getItem('openid');
    loginAction.sourcedata = $.getUrlParam('source');
    
    if(loginAction.openId == null || loginAction.openId == undefined || loginAction.openId == "" || loginAction.openId == "null"){

      Authorized(function(datasoure){
        if(datasoure.data.isBindAccount == false){
          loginAction.openId = datasoure.data.openid;
        }
        
      },3)
    }
      
    loginAction.DataValidCode();

  },
  DataValidCode: function(){
    huiguPost(function(data){
        if(data.code == 0){

          $("#fromImg .validCode").attr("src","data:image/png;base64," + data.data.captchInfo); //测试环境需要加上
          //$("#fromImg .validCode").attr("src","data:image/png;base64,"); //正式环境需要加上
          
        }else{
          setToast3(data.msg);
        }
    },huiguPostUrl.getCaptchaByte,{});
  },
  checkAction: function(){
    let check = document.getElementById("check").checked;
    if(check == true){
      $(".piaochecked").addClass("on_check");
      document.getElementById('btn').disabled = false;
    }else if(check == false){
      $(".piaochecked").removeClass("on_check");
      document.getElementById('btn').disabled = true;
    }
  },
  phoneNumchecked: function(){
    var $phone = document.getElementById("mobilePhone").value;  //手机号码
    var $imgphoto = document.getElementById("imgphoto").value;  //手机号码
    //判断手机号是否输入正确
    if(!$phone){
      setToast3("请输入手机号码");
      $(".from-phone input").focus();
      return false;
    }else if(!/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test($phone)){
      setToast3("请输入有效的手机号码");
      $(".from-phone input").focus();
      return false;
    }else if(!$imgphoto){
      setToast3("请输入图形验证码");
      $(".from-img input").focus();
      return false;
    }else{
      loginAction.mobilePhone = $phone;
      loginAction.validCode = $imgphoto;
      huiguPost(function(data){
          if(data.code == 0){
            $(".login-layout").fadeIn(300);
            $(".login-layout p").html("验证码短信已发送，请注意查收~" + data.data.objData);
            //运行倒计时
            loginAction.countdown(loginAction.$btnCode.find(".djs"), 60, function () {
              loginAction.$btnCode.find(".huoqu").show();
              loginAction.$btnCode.find(".djs").hide();
              //$(".authcode").prop('disabled', false);

            });

            $(".login-layout a").on("click","a",function(){
              $(".login-layout").fadeOut(300);
            })
          }else if(data.code == 500 || data.code == 501){
            setToast3(data.msg);
            loginAction.DataValidCode();
          }else{
            setToast3(data.msg);
            loginAction.DataValidCode();
          }
      },huiguPostUrl.getCaptcha,{"mobilePhone":loginAction.mobilePhone,"validCode":loginAction.validCode})
      return true;
    }

    $(".login-layout").fadeIn(300);
  },
  submit:function(){
    var $phone = document.getElementById("mobilePhone").value;  //手机号码
    var $captcha = document.getElementById("imgphoto").value; //获取图形验证码
    var $validCode = document.getElementById("captcha").value; //获取验证码
    if($phone && /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test($phone)){
      loginAction.mobilePhone = $phone;
    }else{
      setToast3("请输入有效的手机号码");
      $(".from-phone input").focus();
      return false;
    }
    
    if(!$captcha || $captcha.length != 4){
      setToast3("请输入有效的图形验证码");
      $(".from-img input").focus();
      return;
    }else{
      loginAction.captcha = $validCode;
    }

    if(!$validCode || $validCode.length != 4){
      $(".from-yzm input").focus();
      setToast3("请输入有效的验证码");
      return;
    }
    
    huiguPost(function(data){
      if(data.code == 0){
        var dataValue = data.data;
        if(dataValue.isNewUser == true){
          setToast3("注册成功");
        }else{
          setToast3("登录成功");
        }
        localStorage.setItem('mobilePhone', loginAction.mobilePhone);
        localStorage.setItem('iconUrl', dataValue.iconUrl);
        localStorage.setItem('token', dataValue.loginToken);//存储token
        localStorage.setItem('isSubscribe', dataValue.isSubscribe);//存储是否关注过公众账号
        localStorage.setItem('ofPatientId', dataValue.ofPatientId); //存储就诊人Id
        localStorage.setItem('patientId', dataValue.patientId);  //患者Id
        localStorage.setItem('patientAccid', dataValue.patientAccid);  //患者聊天Id
        localStorage.setItem('patientImToken', dataValue.patientImToken);  //云信token
        localStorage.setItem('ofPatientName', dataValue.ofPatientName); //患者名称

        //判断是否有患者
        if(dataValue.isBindOfPatient == true){
          //判断是否是二维码扫描进入的
          if(localStorage.getItem('doctorid') == "" || localStorage.getItem('doctorid') == null){
            if(dataValue.isSubscribe == true){
              if(loginAction.sourcedata == 2){
                top.location.href = dataPath.WXhttpPathch + 'build/vuepage/menu/self';
              }else if(loginAction.sourcedata == 3){
                top.location.href = dataPath.WXhttpPathch + 'build/pages/patient/orderlist/orderlist.html';
              }else{
                top.location.href = dataPath.WXhttpPathch + 'build/vuepage/menu/self';
              }
              
            }else{
              top.location.href = dataPath.WXhttpPathch + 'build/pages/card/follow.html';
            }
          }else{
            huiguPost(function(data){
              if(data.code == 0){
                if(dataValue.isSubscribe == true){
                  top.location.href = dataPath.WXhttpPathch + 'build/vuepage/menu/self';
                }else{
                  top.location.href = dataPath.WXhttpPathch + 'build/pages/card/follow.html';
                  
                }
              }
            },huiguPostUrl.getDoctorRelation,{'ofPatientId':dataValue.ofPatientId,'doctorUserId':localStorage.getItem('doctorid')})
          }
        }else{
          top.location.href = dataPath.WXhttpPathch + 'build/pages/card/card.html';
        }
        

      }else{
        setToast3(data.msg);
      }
    },huiguPostUrl.getValidatePatientCode,{"mobilePhone":loginAction.mobilePhone,"captcha":loginAction.captcha,"openId":loginAction.openId})
  },
  layoutClick: function(){
    $(".login-layout").fadeOut(300);
  },
  countdown: function(btnEle, totalNum, callback){
    var timer = null;
    $(".authcode .huoqu").hide();
    $(".authcode .djs").show();
    btnEle.find('i').text(totalNum);
    timer = setInterval(function () {
        totalNum --;
        if(totalNum <= 0){
            btnEle.find('i').text('');
            callback();
            clearInterval(timer);
            return;
        }
        
        btnEle.find('i').text(totalNum);
    }, 1000);
  }
}

loginAction.init();