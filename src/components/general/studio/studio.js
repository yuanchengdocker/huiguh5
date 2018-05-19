require(['../../common/common.js'],function(common){
    require(['utils','Pullload'],function(utils,Pullload) {
        var studio = {
            detailIndex:0, //0简介，1成员，2作品，3服务 
            indexLength:4,
            moveChange:false,
            container:document.getElementById("studio-container"),
            doctorStudioId:utils.optUrlParams("doctorStudioId")||"",
            init:function(){
                var self = this;
                this.viewInit();
                this.dataDinit({data:{}});
                this.getStudioDetailandService(this.dataDinit,this.dataSinit,this.doctorStudioId)

                var mPullload = new Pullload("member-container",$("#member-item").html(),this.getMemberList.bind(this),20);
                mPullload.init();
                var aPullload = new Pullload("article-container",$("#article-item").html(),this.getProductionList.bind(this),20);
                aPullload.init();
                utils.pullRefresh($("#member-container")[0],mPullload.init.bind(mPullload));
                utils.pullRefresh($("#article-container")[0],aPullload.init.bind(aPullload));
            },
            dataDinit:function(data){
                $(".studio-header").html(_.template($("#studio-header").html()) (data));
                $("#studio-detail-page").html(_.template($("#studio-detail-container").html()) (data));
                // $.getScript("../../../common/js/download-bar.js")
            },
            dataSinit:function(data){
                var buildData = [];
                if(!data) buildData = [];
                (data&&data.serviceInfo)&&data.serviceInfo.map(function(item){
                    var d = {linkname:"服务成员"};
                    switch(item){
                        case 1:d.img = "../../../img/op-advance.png";d.title = "手术快约";break;
                        case 2:d.img = "../../../img/teach.png";d.title = "培训教育";break;
                        case 3:d.img = "../../../img/advance-see.png";d.title = "预约坐诊";break;
                    }
                    buildData.push(d);
                })
                buildData.push({
                    img:"../../../img/office-mam.png",
                    title:"科室管理",
                    linkname:"申请预约"
                })
                $(".service-container").html(_.template($("#service-item").html()) ({data:buildData}));
                // $.getScript("../../../common/js/download-bar.js")
            },
            viewInit:function(){
                var self = this;
                $(".studio-tab-container .studio-tab-item").bind('click',function(){
                    if(!$(this).hasClass('studio-tab-active')){
                        var index = $(this).index();
                        self.detailIndex = index;
                        self.tabChangeFn(self.detailIndex);
                    }
                })

                utils.touchTarget(document.getElementsByClassName("studio-list")[0],function(){
                    if(self.detailIndex == 0 || self.moveChange) return;
                    self.tabChangeFn(--self.detailIndex);
                    self.moveChange = true;
                    setTimeout(function(){
                        self.moveChange = false;
                    },400)
                },function(){
                    if(self.detailIndex == (self.indexLength-1) || self.moveChange) return;
                    self.tabChangeFn(++self.detailIndex);
                    self.moveChange = true;
                    setTimeout(function(){
                        self.moveChange = false;
                    },400)
                })
            },
            tabChangeFn:function(index){
                let self = this;
                self.detailIndex = index;
                var active = $(".studio-tab-active");
                var target = active.parent().children().eq(self.detailIndex);
                target.addClass('studio-tab-active')
                active.removeClass('studio-tab-active')

                $(".active-flag").attr('class',"active-flag active-"+self.detailIndex);

                $(self.container).css('margin-left','-'+self.detailIndex*100+"%");
                
            },
            getStudioDetailandService:function(callbackD,callbackS,id){
                if(!id) return;
                //详情
                huiguPost(function(data){
                    if(data.code == 0){
                        callbackD&&callbackD(data);
                    }
                },huiguPostUrl.getDoctorStudioSpecificInfo,{doctorStudioId:id})
                //服务列表
                huiguPost(function(data){
                    if(data.code == 0){
                        callbackS&&callbackS(data.data);
                    }
                },huiguPostUrl.queryService,{doctorStudioId:id})
            },
            getMemberList:function(callback,startIndex){
                if(!this.doctorStudioId) return;
                huiguPost(function(data){
                    if(data.code == 0){
                        callback&&callback(data.data);
                    }
                },huiguPostUrl.queryDoctorStudioMembers,{doctorStudioId:this.doctorStudioId,startIndex:startIndex*20,pageSize:20})
            },
            getProductionList:function(callback,startIndex){
                if(!this.doctorStudioId) return;
                huiguPost(function(data){
                    if(data.code == 0){
                        callback&&callback(data.data.productionDetailDtoList);
                    }
                },huiguPostUrl.getExpertProduction,{itemId:this.doctorStudioId,startIndex:startIndex*20,pageSize:20,itemType:2})
            }

         }

         studio.init();
    })
})