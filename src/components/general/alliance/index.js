require(['../../common/common.js'],function(common){
    require(['utils','Video','swiper','Pullload','HeadOpacity','Conference'],function(utils,Video,Swiper,Pullload,HeadOpacity,Conference) {
        
        var allianceDetail = {
            expertAllianceId : utils.optUrlParams("expertAllianceId"),
            isNative : false,
            init:function(){
                var self = this;
                //详情
                this.getAllianceDetail(this.dataInit);
                //医院
                var mPullload = new Pullload("alliance-hosp-container",$("#AllianceHosp").html(),this.getHospitalList.bind(this),20,null,
                        document.getElementsByClassName("alliance-detail")[0]);
                mPullload.init();
                this.viewInit();
                //会议
                var cPullload = new Pullload("alliance-conference","",this.getConferenceList.bind(this),20,this.dataCinit.bind(this));

                cPullload.init();
                //服务
                this.getServiceList(this.dataSinit)

            },
            //固定试图初始化
            viewInit:function(){
                var self = this;
                $(".alliance-tab-container .alliance-tab-item").bind('click',function(){
                    if(!$(this).hasClass('alliance-tab-active')){
                        var index = $(this).index();
                        self.detailIndex = index;
                        self.tabChangeFn(self.detailIndex);
                    }
                });
                (new HeadOpacity($(".alliance-banner"),$(".huigu-header"))).init(self.moveControl);
            },
            moveControl:function(flag){
                var box = $(".alliance-index-box");
                var c = "huigu-box-opaque";//达到顶部滑动
                if(flag && !box.hasClass(c)){
                    box.addClass(c)
                }
                if(!flag && box.hasClass(c)){
                    box.removeClass(c)
                }
                $(".alliance-item").on('scroll',function(){
                    var top = $(this)[0].scrollTop
                    if(top == 0 && box.hasClass(c)){
                        box.removeClass(c)
                    }
                })
            },
            //tab子页面切换
            tabChangeFn:function(index){
                let self = this;
                self.detailIndex = index;
                var active = $(".alliance-tab-active");
                var target = active.parent().children().eq(self.detailIndex);
                target.addClass('alliance-tab-active')
                active.removeClass('alliance-tab-active')

                $(".active-flag").attr('class',"active-flag active-"+self.detailIndex);

                $("#alliance-container").css('margin-left','-'+self.detailIndex*100+"%");
                
            },
            //详情数据更新到页面
            dataInit:function(data){
                data.cooperateExperts&&data.cooperateExperts.map(function(item){
                    item.userUrl = item.userId?"/build/components/general/personal/index.html?doctorUserId="+item.userId:"javascript:void(0);";
                })
                //banner图
                $(".alliance-banner").html(_.template($("#banner").html()) ({data:data}))
              
                //详情
                $("#alliance-introduce-container").html(_.template($("#detail").html()) ({data:data}))
                var str = data.introduction.replace(/\n/g,' </br>')
                $('.alliance-info-main').html(str)
            },

            //服务数据到页面
            dataSinit:function(data){
                var buildData = [];
                if(!data) buildData = [];
                data&&data.map(function(item){
                    var d = {linkname:"服务成员"};
                    switch(item.serviceId){
                        case "1":d.img = "../../../img/op-advance.png";d.title = "手术快约";break;
                        case "2":d.img = "../../../img/teach.png";d.title = "培训教育";break;
                        case "3":d.img = "../../../img/advance-see.png";d.title = "预约坐诊";break;
                    }
                    if(allianceDetail.isNative){
                        d.url = "/build2/components/general/serviceMember/index.html?serviceId="+item.serviceId+"&expertAllianceId="+allianceDetail.expertAllianceId;
                    }
                    buildData.push(d);
                })

                buildData.push({
                    img:"../../../img/office-mam.png",
                    title:"科室管理",
                    linkname:"申请预约",
                    url:allianceDetail.isNative?"/build2/components/general/adofficesManage/adofficesManage.html":""
                })
                $("#service-container").html(_.template($("#service").html()) ({data:buildData}));
            },
            //会议数据更新到页面
            dataCinit:function(data){
                data&&data.forEach(function(el){
                    if(!el) return;
                    el.itemId = el.conferenceId;
                    var conference = new Conference("alliance-conference",el,!allianceDetail.isNative)
                    conference.init();
                })
            },
            //详情
            getAllianceDetail:function(callback){
                var params = {
                    expertAllianceId:this.expertAllianceId
                };
                huiguPost(function(data){
                    if(data.code==0){
                        callback && callback(data.data)
                    }
                },huiguPostUrl.getAllianceDetail,params)
            },
            //医院获取
            getHospitalList:function(callback,startIndex){
                var params = {
                    "expertAllianceId":this.expertAllianceId,
                    "startIndex":startIndex*20,
                    "pageSize":20
                };
                huiguPost(function(data){
                    if(data.code==0){
                        callback && callback(data.data)
                    }
                },huiguPostUrl.getHospitalList,params)
            },
            //会议获取
            getConferenceList:function(callback,startIndex){
                var params = {
                    expertAllianceId:this.expertAllianceId,
                    pageSize:20,
                    startIndex:startIndex*20
                };
                huiguPost(function(data){
                    if(data.code==0){
                        callback && callback(data.data)
                    }
                },huiguPostUrl.queryConferenceList,params)
            },
            //服务获取
            getServiceList:function(callback){
                var params = {expertAllianceId:this.expertAllianceId};
                huiguPost(function(data){
                    if(data.code==0){
                        callback && callback(data.data)
                    }
                },huiguPostUrl.queryServiceList,params)
            }

        }
    
        allianceDetail.init();

    })
})