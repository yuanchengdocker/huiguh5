var conferenceDetailAction = {
    conferenceId:"",
    currentTab:1,
    closeTime:0,
    hasOrderCount:0,
    totalOrderCount:0,
    conferenceStatus:0,
    tabOrder:{
        "detail-tab-introduce":1,
        "detail-tab-schedule":2,
        "detail-tab-guest":3
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
        for(var item in self.tabOrder){
            if(self.tabOrder[item]!=self.currentTab){
            }else{
                $("."+item).css("height","auto")
            }
        }

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
    countDown:function(){
        $(".detail-submit .detail-submit-count").text("(已预约"+this.hasOrderCount+")");
        if(this.conferenceStatus!=0){
            $(".detail-adimg-time").text(this.conferenceStatus==2?"已约满":"已截止");
            $(".detail-submit .detail-submit-status").text(this.conferenceStatus==2?"已约满":"已截止");
            $(".detail-submit").addClass("disable-submit")
            $(".detail-submit").removeClass("download-btn")
            $(".detail-submit").attr("onclick","")
            return false;
        }else{
            $(".detail-submit").addClass("able-submit")
            $(".detail-submit").addClass("download-btn")
        }
        var firstMiao = 0;
        var self = this;
        var countTimeFlag = null;
        function countTime(){
            var currentTime = new Date();
            var countDownTime = new Date(self.closeTime);
            var res = countDownTime - currentTime;
            if(res <= 0){
                $(".detail-adimg-time").text("已截止");
                $(".detail-submit .detail-submit-status").text("已截止");
                $(".detail-submit").addClass("disable-submit")
                $(".detail-submit").attr("onclick","")
                clearInterval(countTimeFlag);
                return false;
            }
            // $(".detail-submit").removeClass("disable-submit")
            // $(".detail-submit").attr("href","/src/pages/conference/apply/apply.html")
            var t = res/(1000*60*60)
            var day = parseInt(t/24);
            var hour = parseInt((t/24-day)*24);
            var minute = parseInt(((t/24-day)*24-hour)*60);
            firstMiao = parseInt((((t/24-day)*24-hour)*60-minute)*60);
            minute += 1;
            if(minute==60){
                minute = 0;
                hour += 1;
            }
            $(".detail-adimg-time").text("距预约截止  "+day+"天"+hour+"时"+minute+"分");
            return true;
        }
        if(!countTime()){
            return false;
        }
        setTimeout(function(){
            countTimeFlag = setInterval(function(){
                countTime();
            },60*1000);
            countTime();
        },(firstMiao+1)*1000)
        return true;
    },
    gotoApply:function(){
        var self = this;
        huiguPost(function(data){
            if(data.code==0){
                conferenceDetailAction.conferenceStatus=data.data.conferenceStatus
                conferenceDetailAction.hasOrderCount=data.data.appointedTicket
                conferenceDetailAction.closeTime=data.data.appointEndTime
                conferenceDetailAction.conferenceId=data.data.conferenceId
                var gotoCheck = conferenceDetailAction.countDown();
                if(gotoCheck){
                    accountNumber('../apply/apply.html?conferenceId='+self.conferenceId)
                }else{
                    setToast3($(".detail-adimg-time").text());
                }
            }else if(data.code==65015){
                setToast3("会议已下线！");
                setTimeout(function() {
                    history.back();
                }, 2000);
            }else{
                $(".detail-submit").addClass("disable-submit")
                $(".detail-submit").attr("onclick","")
                setToast3("查询失败！");
            }
        },huiguPostUrl.conferenceDetail,{conferenceId:optUrlParams("conferenceId")})
    }
}
$(document).ready(function() {
    
    $(".detail-main").html(_.template($("#conference_detail_cont").html()) ({
        "conferenceId":0,
        "coverUrl": "",
        "appointEndTime":0,
        "conferenceName":"",
        "holdingStartTime":0,
        "holdingEndTime":0,
        "holdingCity":"",
        "holdingPlace":"",
        "conferenceStatus":0,
        "appointedTicket":0,
        "introduction":'',
        "schedule":"",
        "specialGuest":""
    }))
    huiguPost(function(data){
        if(data.code==0){
            $(".detail-main").html(_.template($("#conference_detail_cont").html()) (data.data))
            conferenceDetailAction.conferenceStatus=data.data.conferenceStatus
            conferenceDetailAction.hasOrderCount=data.data.appointedTicket
            conferenceDetailAction.closeTime=data.data.appointEndTime
            conferenceDetailAction.conferenceId=data.data.conferenceId
            conferenceDetailAction.countDown();

        }else if(data.code==65015){
            setToast3("会议已下线！");
            setTimeout(function() {
                history.back();
            }, 2000);
        }else{
            $(".detail-submit").addClass("disable-submit")
            $(".detail-submit").attr("onclick","")
            setToast3("请求失败！");
        }
    },huiguPostUrl.conferenceDetail,{conferenceId:optUrlParams("conferenceId")})
})
