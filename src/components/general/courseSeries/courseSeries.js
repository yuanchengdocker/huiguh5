require(['../../common/common.js'],function(common){
    require(['utils'],function(utils) {
        var courseSeries = {
            projectId:utils.optUrlParams("projectId")||"",
            init:function(){
                this.dataInit({data:{}})
                this.getSeries(this.dataInit,this.projectId);
            },
            dataInit:function(data){
                $("#course-series-container").html(_.template($("#course-series").html()) (data))
            },
            getSeries:function(callback,id){
                if(!id) return;
                huiguPost(function(data){
                    if(data.code == 0){
                        callback&&callback(data);
                    }
                },huiguPostUrl.projectDetail,{projectId:id})
            }

         }


         courseSeries.init();
    })
})