var conferenceDetailAction = {
    conferenceId:"",
    currentTab:1,
    tabOrder:{
        "detail-tab-introduce":1,
        "detail-tab-team":2,
        "detail-tab-opus":3,
        "detail-tab-serve":4
    },
    tabChange:function(id){
        var tabItem = $("#"+id);
        this.currentTab = this.tabOrder[id];
        var tabItemClass = tabItem.attr("class");
        if(tabItemClass&&tabItemClass.indexOf("tab-active")>=0) return;
        $(".detail-tab-container").find(".tab-active").removeClass("tab-active");
        $(".detail-tab-container").find(".tab-bar").hide();
        tabItem.addClass("tab-active");
        tabItem.prev().show();

        var self = this;
        if(self.currentTab == 2){
            team();
            $(".detail-tab-team ul").html("");
            //console.log(self.currentTab);
        }else if(self.currentTab == 3){
            opus();
            $(".detail-tab-opus ul").html("");
            //console.log(self.currentTab);
        }else if(self.currentTab == 4){
            serve();
            //console.log(self.currentTab);
        }
        for(var item in self.tabOrder){
            if(self.tabOrder[item]!=self.currentTab){
            }else{
                $("."+item).css("height","auto")
            }
        }


        // $(".tab-bar").css("transform",'translate3d('+((this.currentTab-1)*$(".detail-tab-container").width()/3+(this.currentTab-1)*Math.floor($(".tab-bar").width()*(34/90)))+'px,0px,0px)');
        $(".tab-container").animate({"margin-left":-((self.tabOrder[id]-1)*parseFloat($(".detail-tab-introduce").css("width").split("px")[0]))+"px"},200,function(){
            for(var item in self.tabOrder){
                if(self.tabOrder[item]!=self.currentTab){
                    $("."+item).css("height","0px")
                }else{
                    $("."+item).css("height","auto")
                }
            }
        });
        
    },
};

//团队请求接口
function team(){
    var startIndex=0,pageSize=10,ajaxLock = false;
    $("html").height("auto")
    var getData = function(){
        huiguPost(function(data){
            ajaxLock = false;
            if(data.code==0){
                if (data.data == null) {
                    ajaxLock = true;
                    if(startIndex == 0){
                      $(".detail-tab-team .personal-empty").show();
                    }
                    return;
                }else{
                    var datalenght = data.data.length;
                    if(datalenght < pageSize){
                      ajaxLock = true;
                    }
                    if (datalenght == 0) {
                      ajaxLock = true;
                      if(startIndex == 0){
                        $(".detail-tab-team .personal-empty").show();
                      }
                      return
                    }
                }

            }else{
                ajaxLock = true;
                return
            }
            var ele =  _.template($("#teamList").html()) (data);
            $(".detail-tab-team ul").append(ele);
            if(startIndex==0 && $(".detail-tab-team ul").height() < window.screen.height){
                $("html").height("100%")
                $("body").height("100%")
            }
        },huiguPostUrl.getQueryDoctorStudio,{"doctorUserId":optUrlParams("doctorUserId"),"startIndex":startIndex,"pageSize":pageSize})
    }
    
   getData();
    window.addEventListener('scroll', function (e) {
        var wScrollY = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop || 0;
        var wInnerH = window.innerHeight; // 设备窗口的高度（不会变）
        var bScrollH = document.body.scrollHeight; // 滚动条总高度
        if (wScrollY + wInnerH >= bScrollH - 100) {
           if (!ajaxLock) {
            startIndex = startIndex + pageSize;
            getData();  
            ajaxLock = true;
          }
      }
    });
}
//作品请求接口
function opus(){
    var startIndex=0,pageSize=10,ajaxLock = false;
    $("html").height("auto")
    var getData = function(){
        huiguPost(function(data){
            ajaxLock = false;
            if(data.code==0){
                if (data.data == null) {
                    ajaxLock = true;
                    if(startIndex == 0){
                      $(".detail-tab-opus .personal-empty").show();
                    }
                    return;
                }else{
                    var datalenght = data.data.productionDetailDtoList;
                    if(datalenght < pageSize){
                      ajaxLock = true;
                    }
                    if (datalenght == 0) {
                      ajaxLock = true;
                      if(startIndex == 0){
                        $(".detail-tab-opus .personal-empty").show();
                      }
                      return
                    }
                }

            }else{
                ajaxLock = true;
                return
            }
            var ele =  _.template($("#opusList").html()) (data.data);
            $(".detail-tab-opus ul").append(ele);
            if(startIndex==0 && $(".detail-tab-opus ul").height() < window.screen.height){
                $("html").height("100%")
                $("body").height("100%")
            }
        },huiguPostUrl.getExpertProduction,{"itemId":optUrlParams("doctorUserId"),"itemType":1,"startIndex":startIndex,"pageSize":pageSize})
    }
    
   getData();
    window.addEventListener('scroll', function (e) {
        var wScrollY = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop || 0;
        var wInnerH = window.innerHeight; // 设备窗口的高度（不会变）
        var bScrollH = document.body.scrollHeight; // 滚动条总高度
        if (wScrollY + wInnerH >= bScrollH - 100) {
           if (!ajaxLock) {
            startIndex = startIndex + pageSize;
            getData();  
            ajaxLock = true;
          }
      }
    });
}
//服务请求接口
function serve(){
    huiguPost(function(data){
        if(data.code==0){
            if(Object.prototype.toString.call(data.data.serviceInfo) === '[object Array]' && data.data.serviceInfo.length === 0 && Object.prototype.toString.call(data.data.speicalService) === '[object Array]' && data.data.speicalService.length === 0){
                $(".detail-tab-serve .personal-empty").show();
            }else{
                $(".detail-tab-serve .personal-empty").hide();
                $(".detail-tab-serve").html(_.template($("#serveList").html()) (data.data))
            }
        }else{
            $(".detail-tab-opus .personal-empty").show();
            setToast3("请求失败！");
        }
    },huiguPostUrl.getExpertService,{"doctorUserId":optUrlParams("doctorUserId")})
}

//设置为空或者报错显示
$(document).ready(function() {
    $(".detail-cont").html(_.template($("#personal_detail_cont").html()) ({
        "conferenceId":0,
        "userDescribe":'',
        "serviceInfo":'',
        "expertise":'',
    }))
    $(".detail-header").html(_.template($("#personal_detail").html()) ({
        "conferenceId":0,
        "avatarUrl":'',
        "doctorStatus":'',
        "doctorName":'',
        "professionalTitleName":'',
        "subDepartmentName":'',
        "hospitalName":'',
        "expertiseTag":[]
    }))
    huiguPost(function(data){
        if(data.code==0){
            var expertTag = data.data.expertiseTag;
            for(var i =0; i< expertTag.length; i++){
                if(data.data.expertiseTag[i] == null){}else{
                  data.data.expertiseTag[i] = cutstr(expertTag[i],8);
                }
            }
            data.data.doctorName = cutstr(data.data.doctorName,10);
            $(".detail-cont").html(_.template($("#personal_detail_cont").html()) (data.data))
            $(".detail-header").html(_.template($("#personal_detail").html()) (data.data))
            conferenceDetailAction.conferenceId=data.data.conferenceId
            if(!data.data.userDescribe){
                $(".detail-tab-introduce .personal-empty").show();
            }
        }else{
            setToast3("请求失败！");
        }
    },huiguPostUrl.getDoctorHomeService,{"doctorUserId":optUrlParams("doctorUserId")})
})
