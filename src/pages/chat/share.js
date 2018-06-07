//textarea输入框
function wordStatic(input) {  
    // 获取要显示已经输入字数文本框对象
    input.nextElementSibling.childNodes[0].innerHTML = input.value.length ;
}

var applyAction={
    requireList:{
        applyFromCard:"请填写身份证号",
        applyFormName:"请填写姓名",
        applyFormPhone:"请填写手机号",
    },
    postParams:{
        applyFromCard:"",
        applyFormName:"",
        applyFormPhone:"",
        actionTitle:"",
    },
    idCardNumchecked:function(){
        var fromCardObj = document.getElementById("applyFromCard");
        var idCard = function(p){var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  return reg.test(p);}
        var fromCardNum = fromCardObj.value;
        if(fromCardNum && idCard(fromCardObj.value)){
            this.postParams.applyFromCard = fromCardNum;
            return true;
        } else{
            setToast3("请输入有效的身份证号")
            fromCardObj.focus();
            return false;
        }
    },
    requiredChecked:function(){
        var formNameObj = document.getElementById("applyFormName");
        var formNameNum = formNameObj.value;
        if(formNameNum){
            this.postParams.applyFormName = formNameNum;
            return true;
        } else{
            setToast3("请输入姓名")
            formNameObj.focus();
            return false;
        }
    },
    phoneNumchecked:function(){
        var formPhoneObj = document.getElementById("applyFormPhone");
        var formPhoneNum = formPhoneObj.value;
        if(formPhoneNum && /^1\d{10}$/.test(formPhoneNum)){
            this.postParams.applyFormPhone = formPhoneNum;
            return true;
        } else{
            setToast3("请输入有效的手机号！")
            formPhoneObj.focus();
            return false;
        }
    },
    submit:function(){
        var idCardNumchecked = this.idCardNumchecked();
        if(!idCardNumchecked) return;
        var requiredChecked = this.requiredChecked();
        if(!requiredChecked) return;
        var phoneNumchecked = this.phoneNumchecked();
        if(!phoneNumchecked) return;
        
        $(".flup-btn").attr("disabled",true);
        $(".flup-eject").show();

    },
    cancel:function(){
        $(".flup-eject").hide();
        $(".flup-btn").attr("disabled",false);
    },
    sure:function(){
        var r = this.postParams;
        var table = $(".flup-table .flup-from");
        var topicJson = []; //申请内容的json数据
        for(var i=0; i< table.length; i++){ 
            var dataId = table[i].dataset.id; //获取题目ID
            var tableName = table[i].className;
            
            //var title = table[i].children[0].innerText; //题目标题
            var question = table[i].children[1]; //小题题目
            
            var topicDetailList =[]; //题目数据
            var Type;
            var topicDetailId;
            var topicDetail;
            //填空题
            if(tableName.indexOf("from-pack")>0){
                topicDetailId = question.children[0].dataset.id;
                var answerContent = question.children[0].value;
                Type = 1;
            //单选题以及多选
            }else if(tableName.indexOf("from-radio")>0){
                let labelDetail = question.children;
                for(var j=0; j<labelDetail.length; j++){
                    topicDetailId = labelDetail[j].dataset.id;
                    let selectBool = labelDetail[j].attributes[0].value;
                    let isSelect = selectBool === "false" ? false : true;  
                    let content = labelDetail[j].children[2].textContent;
                    topicDetail = {
                        "topicDetailId":topicDetailId,
                        "content":content,
                        "isSelect":isSelect
                    }
                    topicDetailList.push(topicDetail);
                }
                Type = 2;
            //多选题
            }else if(tableName.indexOf("from-checkbox")>0){
                let  labelDetail = question.children;
                for(var j=0; j<labelDetail.length; j++){
                    topicDetailId = labelDetail[j].dataset.id;
                    let selectBool = labelDetail[j].attributes[0].value;
                    let isSelect = selectBool === "false" ? false : true;  
                    let content = labelDetail[j].children[2].textContent;
                    topicDetail = {
                        "topicDetailId":topicDetailId,
                        "content":content,
                        "isSelect":isSelect
                    }
                    topicDetailList.push(topicDetail);
                }
                Type = 3;
            }
            var topicsDetail = {
                "topicId": dataId,
                //"title":title,
                "Type":Type,
                "answerContent":answerContent,
                "topicDetailList":topicDetailList
            }
            topicJson.push(topicsDetail); //存储数据
            
        }

        var ofPatientId;
        var url = window.location.href;
        if(url.indexOf("ofPatientId") >= 0 ) { //判断url地址中是否包含link字符串
          ofPatientId = optUrlParams("ofPatientId");
        }else{
          ofPatientId = "";
        }
        huiguPost(function(data){
            if(data.code==0){
                setToast3("提交成功");
                setTimeout(function(){
                    parent.questionSubmitCallback(optUrlParams("followupQuestionnaireId"),applyAction.postParams.actionTitle,data.data.followupQuestionnairePatientId);
                },2000)
            }else{
                setToast3(data.msg);
            }
        },huiguPostUrl.getAnswerFollowUp,{
            identityCard:r.applyFromCard,
            patientName:r.applyFormName,
            mobilePhone:r.applyFormPhone,
            followupQuestionnaireId: optUrlParams("followupQuestionnaireId"),
            ofPatientId:ofPatientId,
            topicJson:topicJson
        },$(".apply-submit"));
    }
}

var patientEducationId;
var applyToast={
    submit:function(){
       $(".flup-eject2").show();
    },
    cancel:function(){
        $(".flup-eject2").hide();
    },
    sure:function(){
        $(".flup-eject2").hide();
        top.location.href ='detail.html?patientEducationId=' + patientEducationId;
    }
}

$(document).ready(function() {
    // $(".flup-content").html(_.template($("#share_from").html()) ({
    //     patientName:"",
    //     identityCard:"",
    //     mobilePhone:"",
    // }))
    var ofPatientId;
    var url = window.location.href;
    if(url.indexOf("ofPatientId") >= 0 ) { //判断url地址中是否包含link字符串
      ofPatientId = optUrlParams("ofPatientId");
    }else{
      ofPatientId = "";
    }
    
    huiguPost(function(data){
        if (data.code == 0) {
            $(".flup-content").html(_.template($("#share_from").html()) (data.data))
            applyAction.postParams.actionTitle=data.data.title;
            applyAction.postParams.applyFromCard=data.data.identityCard
            applyAction.postParams.applyFormName=data.data.patientName
            applyAction.postParams.applyFormPhone=data.data.mobilePhone

            check();

            patientEducationId = data.data.patientEducationId;
            
        }
    },huiguPostUrl.getSearchFollowUp,{"followupQuestionnaireId":optUrlParams("followupQuestionnaireId"),"ofPatientId":ofPatientId })
})


function check(){
    var serviceData = {}; //服务接口数据
    //单选
    $(".divRadio").on("click","label input",function(){
      var $input = $(this),
          $label = $input.parent("label"),
          $text = $input.siblings("textarea"),
          $label_attr = $label.attr("aria-checked");

      if($text.length > 0){
        $text.focus();
      }

      $label.siblings("label").attr("aria-checked", false);
      $label.attr("aria-checked", true);
      $(".care").css("display","none");
    });

    //多选
    $(".divcheckbox").on("click","input,textarea",function(){
      var $input = $(this),
          $text = $input.siblings("textarea"),
          $label = $input.parent("label"),
          $label_attr = $label.attr("aria-checked");

        if($text.length > 0){
          $text.focus();
        }
        if($label_attr == "false"){
          $label.attr("aria-checked", true);
          $(".care").css("display","none");

        }else{
          $label.attr("aria-checked", false);
        }
    });
}