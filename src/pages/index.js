/*! 这是登录页面以及登陆成功页面 */
var indexAction={
  signPhone: $(".index-top .sign-phone"),
  sign: $(".index-top .sign"),
  login: $(".index-top .login"),
  btnQuit: $(".index-bottom .btn-quit"),
  phoneData: "", //登录手机号
  init: function(){
    indexAction.phoneData = localStorage.getItem('mobilePhone');
    localStorage.setItem('doctorid', $.getUrlParam('doctorid')||"");

    if(indexAction.phoneData == null || indexAction.phoneData == undefined || indexAction.phoneData == "" || indexAction.phoneData == "null"){

      //授权接口
      Authorized(function(data){
        // console.log(data);
        if(data.data.isBindAccount == true){
          if(data.data.isSubscribe == true){
            indexAction.phoneData = data.data.mobilePhone;
            localStorage.setItem('mobilePhone', data.data.mobilePhone);
            setCookie('token',data.data.loginToken);  //设置token
            indexAction.login.css("display","none");
            indexAction.sign.css("display","block");
            indexAction.btnQuit.css("display","block");
            indexAction.signPhone.html(data.data.mobilePhone);
            $("#img").show();
            $('#img').change(function() { 
              var file = this.files[0]; 
              var r = new FileReader(); 
              r.readAsDataURL(file); 
              $(r).load(function() { 
                //上传
                huiguPost(function(data){
                  if(data.code == 0){
                    $(".updata").removeClass("photos");
                    $('.updata').attr("src",data.data.iconUrl); 
                  }else{
                    setToast3("您还未登录，需要去登录");
                    $("#img").hide();
                  }
                },huiguPostUrl.getupdateIcon,{'file':this.result})

              })
                  
            }) 
          }
        }
        
      },1); 
      
    }else{
      
      indexAction.signPhone.html(indexAction.phoneData);
        setCookie('token',localStorage.getItem('token'));  //设置token
        indexAction.login.css("display","none");
        indexAction.sign.css("display","block");
        indexAction.btnQuit.css("display","block");

        $(".upload #img").on("click",function(){
          setToast3("您还未登录，需要去登录");
          $("#img").hide();
        })
      
    }
    

  },
  clickbespeak: function(){
    if(indexAction.phoneData == null || indexAction.phoneData == undefined || indexAction.phoneData == "" || indexAction.phoneData == "null"){
      setToast3("您还没登录，需要去登录");
    }else{
      window.location.href= dataPath.WXhttpPathch + 'build/pages/patient/orderlist/orderlist.html';
    }
  },
  clickquit: function(){
    if(indexAction.phoneData == null || indexAction.phoneData == undefined || indexAction.phoneData == "" || indexAction.phoneData == "null"){
      setToast3("您还没登录");
      setTimeout(function(){
        window.location.href= dataPath.WXhttpPathch + 'build/pages/login.html';
      },1000);
    }else{
      console.log(4);
      indexAction.quit(); //执行方法
    }
  },
  quit: function(){
    $(".index-layout").fadeIn(300);
  },
  quitCancel:function(){
    $(".index-layout").fadeOut(300);
  },
  quitQuit:function(){
    //请求退出登录的接口
    huiguPost(function(data){
      if(data.code == 0){
        $(".index-layout").fadeOut(300);
        deleteCookie("token"); //清除token
        localClear(5);  //清除localStorage
        
        indexAction.phoneData = localStorage.getItem('mobilePhone'); //重新获取值

        indexAction.sign.css("display","none");
        indexAction.login.css("display","block");
        indexAction.btnQuit.css("display","none");

        $(".updata").addClass("photos");
        $('.updata').attr("src","/build/imgWX/updata.png"); 

      }else if(data.indexOf('10016')){
        setToast3("您需要重新登录");
        $(".index-layout").fadeOut(300);
        deleteCookie("token"); //清除token
        localClear(5);  //清除localStorage


        indexAction.sign.css("display","none");
        indexAction.login.css("display","block");
        indexAction.btnQuit.css("display","none");

        window.location.href= dataPath.WXhttpPathch + 'build/pages/login.html';
      }
    },huiguPostUrl.getLogoutToken);
  }
}
indexAction.init();
