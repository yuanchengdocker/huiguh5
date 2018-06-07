/*! 这是登录页面以及登陆成功页面 */
var indexAction={
  signPhone: $(".index-top .sign-phone"),
  sign: $(".index-top .sign"),
  login: $(".index-top .login"),
  btnQuit: $(".index-bottom .btn-quit"),
  phoneData: "", //登录手机号
  iconUrl: "", //登录手机号
  init: function(){
    indexAction.phoneData = localStorage.getItem('mobilePhone');
    indexAction.iconUrl = localStorage.getItem('iconUrl');
    var url = top.location.href;
    

    if(indexAction.phoneData == null || indexAction.phoneData == undefined || indexAction.phoneData == "" || indexAction.phoneData == "null"){

      //授权接口
      Authorized(function(data){
        var datavalue = data.data;
        if(datavalue.isBindAccount == true){
          if(datavalue.isBindOfPatient == true){

            indexAction.phoneData = datavalue.mobilePhone;
            localStorage.setItem('mobilePhone', datavalue.mobilePhone);
            localStorage.setItem('iconUrl', datavalue.iconUrl);
            setCookie('token',datavalue.loginToken);  //设置token
            indexAction.login.css("display","none");
            indexAction.sign.css("display","block");
            indexAction.btnQuit.css("display","block");
            indexAction.signPhone.html(datavalue.mobilePhone);

            $("#img").show();
            $(".updata").removeClass("photos");
            $('.updata').attr("src",datavalue.iconUrl); 

          }
        }else{

          $(".upload .updata").on("click",function(){
            setToast3("您还未登录，需要去登录");
            $("#img").hide();
          })
        }
        
      },1); 
      
    }else{

      if(url.indexOf("doctorid")>0 && optUrlParams('doctorid') != localStorage.getItem('doctorid')){
        localStorage.setItem('doctorid',optUrlParams('doctorid'));
        //进行重新绑定患者步骤
        huiguPost(function(data){},huiguPostUrl.getDoctorRelation,{'ofPatientId':localStorage.getItem('ofPatientId'),'doctorUserId':optUrlParams('doctorid')})
      }

      indexAction.signPhone.html(indexAction.phoneData);
      setCookie('token',localStorage.getItem('token'));  //设置token
      indexAction.login.css("display","none");
      indexAction.sign.css("display","block");
      indexAction.btnQuit.css("display","block");

      $("#img").show();
      $(".updata").removeClass("photos");
      $('.updata').attr("src",indexAction.iconUrl); 
      
    }
    

  },
  clickbespeak: function(){
    if(indexAction.phoneData == null || indexAction.phoneData == undefined || indexAction.phoneData == "" || indexAction.phoneData == "null"){
      setToast3("您还没登录，需要去登录");
    }else{
      top.location.href = dataPath.WXhttpPathch + 'build/pages/patient/orderlist/orderlist.html';
    }
  },
  clickquit: function(){
    if(indexAction.phoneData == null || indexAction.phoneData == undefined || indexAction.phoneData == "" || indexAction.phoneData == "null"){
      setToast3("您还没登录");
      setTimeout(function(){
        top.location.href = dataPath.WXhttpPathch + 'build/pages/login.html';
      },1000);
    }else{
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
        
        $("#img").hide();
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

        top.location.href = dataPath.WXhttpPathch + 'build/pages/login.html';
      }
    },huiguPostUrl.getLogoutToken);
  }
}
indexAction.init();


$('#img').change(function() { 
  var file = this.files[0]; 
  var r = new FileReader(); 
  r.readAsDataURL(file); 
  $(r).load(function() { 
    //上传
    var dataFile = new FormData();
    dataFile.append('file', $('input[name=file]')[0].files[0]);
    //dataFile.append('file', this.result);
    dataFile.append('fileType', 1);

    $.ajax({
      url: huiguPostUrl.getuploadMultipartFile,
      type: 'post',
      contentType: false,
      processData: false,
      cache: false,
      //contentType: 'multipart/form-data',
      data:dataFile,
      success: function(data){
        if(data.code == 0){
          var formvalue = data.data;
          //修改患者头像
          huiguPost(function(data){
            if(data.code == 0){
              $('.updata').attr("src",data.data.iconUrl); 
              localStorage.setItem('iconUrl', data.data.iconUrl);
            }
          },huiguPostUrl.getupdateIcon,{"iconUrl":formvalue.largeImagePath,"thumbUrl":formvalue.smallImagePath});
        }else{
          setToast3("您还未登录，需要去登录");
          $("#img").hide();
        }
      },
      error: function(){
        setToast3("提交失败");
      }
    });
    // huiguPost(function(data){
    //   if(data.code == 0){
        
    //     $('.updata').attr("src",data.data.iconUrl); 
    //   }else{
    //     setToast3("您还未登录，需要去登录");
    //     $("#img").hide();
    //   }
    // },huiguPostUrl.getupdateIcon,{'file':this.result,"fileType":1,})

  })
              
}) 