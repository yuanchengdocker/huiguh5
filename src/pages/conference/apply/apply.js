var conferenceApplyAction={
    requireList:{
        applyFormName:"请填写姓名",
        applyFormPhone:"请填写手机号"
    },
    prodParams:{
        conferenceId:0,
        prodLefts:9,
        prodPrice:1,
        prodNum:1,
        appointUser:"",
        appointPhone:"",
        appointEmail:""
    },
    pageInit:function(data){
        if(data.code == 0){
            conferenceApplyAction.prodParams.prodPrice=data.data.price
            conferenceApplyAction.prodParams.prodLefts=data.data.leftTicket
            conferenceApplyAction.prodParams.conferenceId=data.data.conferenceId
            this.prodParams.prodNum = 1;

            if(this.prodParams.prodNum>=10||(this.prodParams.prodLefts>=0&&this.prodParams.prodNum>=this.prodParams.prodLefts)){
                $("#prodNumAdd").attr("src","/build/img/add-none-flag.png")
            }else{
                $("#prodNumAdd").attr("src","/build/img/add-flag.png")
            }
            if(this.prodParams.prodNum<=1){
                 $("#prodNumDown").attr("src","/build/img/down-none-flag.png")
            }else{
                $("#prodNumDown").attr("src","/build/img/down-flag.png")
            }
            $("#totalPrice").text("￥"+(this.prodParams.prodPrice*this.prodParams.prodNum).toFixed(2));
            $("#prodNum").text(this.prodParams.prodNum);

            $(".apply-main").html(_.template($("#conference_apply_form").html()) (data.data))
            if(data.data.leftTicket<0){
                data.data.leftTicket = "";
            }else{
                
                if(data.data.leftTicket == 0){
                    setToast3("票已售完~");
                    $(".apply-submit").addClass("disable-submit")
                    $(".apply-submit").attr("onclick","")
                }else if(data.data.leftTicket > 1){
                    $("#prodNumAdd").attr("src","/build/img/add-flag.png")
                }
                data.data.leftTicket = "（余票："+data.data.leftTicket+"）";
            }
            $(".apply-head-ticket").text(data.data.leftTicket);
            var currentTime = new Date();
            var countDownTime = new Date(data.data.appointEndTime);
            var res = countDownTime - currentTime;
            if(res <= 0){
                setToast3("已截止");
                $(".apply-submit").addClass("disable-submit")
                $(".apply-submit").attr("onclick","")
            }

        }else{
            $(".apply-submit").addClass("disable-submit")
            $(".apply-submit").attr("onclick","")
            setToast3("请求失败！");
        }
    },
    prodNumChange:function(type){
        if(type>0){
            if(this.prodParams.prodNum>=10||(this.prodParams.prodLefts>=0&&this.prodParams.prodNum>=this.prodParams.prodLefts)){
                setToast3("您已超过最大预约数~")
                return;
            }
        }
        if(type<0&&this.prodParams.prodNum<=1){
            console.log("过小")
            return;
        }
        this.prodParams.prodNum += type;
        if(this.prodParams.prodNum>=10||(this.prodParams.prodLefts>=0&&this.prodParams.prodNum>=this.prodParams.prodLefts)){
            $("#prodNumAdd").attr("src","/build/img/add-none-flag.png")
        }else{
            $("#prodNumAdd").attr("src","/build/img/add-flag.png")
        }
        if(this.prodParams.prodNum<=1){
             $("#prodNumDown").attr("src","/build/img/down-none-flag.png")
        }else{
            $("#prodNumDown").attr("src","/build/img/down-flag.png")
        }

        $("#totalPrice").text("￥"+(this.prodParams.prodPrice*this.prodParams.prodNum).toFixed(2));
        $("#prodNum").text(this.prodParams.prodNum);
    },
    phoneNumchecked:function(){
        var phoneCheck = conferenceApplyAction.requiredChecked('applyFormPhone');
        if(!phoneCheck) return;
        var pObj = document.getElementById("applyFormPhone");
        var pNum = pObj.value;
        if(pNum && /^1\d{10}$/.test(pNum)){
            this.prodParams.appointPhone = pNum;
            return true;
        } else{
            setToast3("请输入有效的手机号！")
            pObj.focus();
            return false;
        }
    },
    emailNumchecked:function(){
        var eObj = document.getElementById("applyFormEmail");
        var eNum = eObj.value;
        if(!eNum||eNum.length<=0) return true;
        if(eNum && /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(eNum)){
            this.prodParams.appointEmail = eNum;
            return true;
        } else{
            setToast3("请输入有效的邮箱！")
            return false;
        }
    },
    requiredChecked:function(objId){
        var result = "";
        var self = this;
        var checkObj=function(id){
            if(!id) return false;
            var obj = document.getElementById(id);
            if(!obj) return false;
            var value = obj.value;
            if(value.length<=0){
                return false
            }
            if(id == "applyFormName"){
                self.prodParams.appointUser = value;
            }
            return true;
        }
        if(objId){
            if(!checkObj(objId)){
                result=this.requireList[objId];
            }
        }else{
            for(var item in this.requireList){
                if(!checkObj(item)){
                    result=this.requireList[item];
                    document.getElementById(item).focus()
                    break;
                }
            }
        }
        if(result){
            setToast3(result)
            return false;
        }else{
            return true;
        }
    },
    submit:function(){
        var requiredChecked = this.requiredChecked();
        if(!requiredChecked) return;
        var phoneNumchecked = this.phoneNumchecked();
        if(!phoneNumchecked) return;
        var emailNumchecked = this.emailNumchecked();
        if(!emailNumchecked) return;

        var r = this.prodParams;
        $(".apply-submit").attr("disabled",true);

        if(getCookie("token")){
            huiguPost(function(data){
                if(data.code==0){
                    setToast3("申请成功");
                    setTimeout(function(){
                        //跳转
                        location.href="yiyikangyunhuigu://bll/app.com?functype=121";
                        
                    },2000)
                }else if([65004,65005,65006,65007,65008].indexOf(data.code) > -1){
                    var tip = "";
                    switch(data.code){
                        case 65004:tip="学术会议不存~";break;
                        case 65006:tip="超过最大可预约票数~";break;
                        case 65007:tip="会议已约满~";break;
                        case 65008:tip="预约已截止~";break;
                        case 65005:tip="学术会议预约数不能为 0~";break;
                    }
                    setToast3(tip);
                    if(data.code!=65006){
                        $(".apply-submit").attr("disabled",true);
                    }
                    huiguPost(function(data){
                        conferenceApplyAction.pageInit(data);

                        // $(".apply-head-time").text("预约截止日期："+formatDateTime(data.data.appointEndTime,"minute"));
                        // if(data.data.leftTicket >= 0)
                        //     $(".apply-head-ticket").text("(余票："+data.data.leftTicket+")");
                    },huiguPostUrl.conferencetoApply,{conferenceId:optUrlParams("conferenceId")})
                }else{
                    setToast3("提交失败，请重新提交");
                    $(".apply-submit").attr("disabled",false);
                }
            },huiguPostUrl.conferenceApply,{
                conferenceId:r.conferenceId,
                appointCount:r.prodNum,
                appointUser:r.appointUser,
                appointPhone:r.appointPhone,
                appointEmail:r.appointEmail
            },$(".apply-submit"))
        }else{
            //提示用户登录
            var dataModel = {
              "action": "yyky_remindtologin",
              "needLogin": true,       //是否需要用户登录
              "needRegistered": true,  //是否需要用户注册账号
            };
            window.callNativeApi('YYKYBridgeFun', 'yykyJSCallToRemindToLogin', dataModel, function (result) { });
        }
        
    }
}
$(document).ready(function() {
    var data2 = {
        "conferenceId":0,
        "conferenceName":"",
        "leftTicket":"（余票：0）",
        "price":0,
        "appointEndTime":0,
        "appointUser":"",
        "appointPhone":"",
        "appointEmail":""
    };
    $(".apply-main").html(_.template($("#conference_apply_form").html()) (data2))
    huiguPost(function(data){
        conferenceApplyAction.pageInit(data);
    },huiguPostUrl.conferencetoApply,{conferenceId:optUrlParams("conferenceId")})
    
})