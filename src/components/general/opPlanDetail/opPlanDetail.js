require(['../../common/common.js'],function(common){
    require(['utils'],function(utils) {
        var schemeDetail = {
            back:utils.optUrlParams("back")||0,
            schemeId:utils.optUrlParams("schemeId")||"",
            init:function(){
                this.dataInit({data:{}})
                this.getSchemeDetail(this.dataInit.bind(this),this.schemeId);
            },
            dataInit:function(data){
                if(data.data&&data.data.serviceAdvantage){
                    data.data.precautions = data.data.precautions.split("\n").join("</br>");
                }
                data.data.back = parseInt(this.back);
                if(parseInt(this.back)){
                    $("#huigu-header").html(_.template($("#huigu-header-container").html()) ())
                }
                $("#scheme-container").html(_.template($("#scheme-detail").html()) (data))
            },
            getSchemeDetail:function(callback,id){
                if(!id) return;
                huiguPost(function(data){
                    if(data.code == 0){
                        callback&&callback(data);
                    }
                },huiguPostUrl.querySchemeDetail,{schemeId:id})
            }
         }
         schemeDetail.init();
    })
})