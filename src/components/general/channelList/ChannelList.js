require(['../../common/common.js'],function(common){
    require(['utils','Banner','CourseSeries','Conference','ArticleModel','Pullload'],function(utils,Banner,CourseSeries,Conference,ArticleModel,Pullload) {

        var videoList = {
            containerId:"college-channel-content",
            channelName:utils.optUrlParams("channelName")||"",
            currentPage:0,
            pageSize:20,
            swiperIndex:0,
            channelId:utils.optUrlParams("channelId")||"",
            categoryId:utils.optUrlParams("categoryId")||"",
            init:function(){
                var _this = this;
                var banner = new Banner("banner-container")
                banner.init()
                this.getBanner(function(data){
                    banner.update(data);
                })
                document.title = this.channelName;
                // this.getArticleList(function(data){
                //     _this.dataInit(data);
                // },this.currentPage)

                var mPullload = new Pullload("video-list-page","",_this.getArticleList.bind(_this),_this.pageSize,_this.dataInit.bind(_this),window);
                mPullload.init();
                // utils.pullRefresh($(".main-content")[0],mPullload.init.bind(mPullload));
            },
            dataInit:function(data){
                var _this = this;
                data&&data.forEach(function(el){
                    if(!el) return;
                    var id = _this.containerId;
                    var element = null;
                    switch(el.itemType){
                        case 1: el.itemType = 0;element = new ArticleModel(id,el);break;
                        case 2: el.itemType = 1;element = new CourseSeries(id,el);break;
                        case 3: el.itemType = 2;element = new CourseSeries(id,el,_this.swiperIndex++);break;
                        case 4: element = new Conference(id,el);break;
                    }
                    element&&element.init();
                })
            },
            getBanner:function(callback){
                huiguPost(function(data){
                    if(data.code == 0){
                        if(!data.data || data.data.length <= 0){
                            $("#video-list-page #banner-container").hide();
                        }else{
                            $("#video-list-page #banner-container").show();
                            callback&&callback(data.data);
                        }
                        
                    }else{
                        utils.Errordata();
                    }
                },huiguPostUrl.getChannelBanner,
                {channelId:this.channelId})
            },
            getArticleList:function(callback,currentPage){
                var param = {channelId:this.channelId,startIndex:currentPage*this.pageSize,pageSize:this.pageSize};
                if(this.categoryId) param['categoryId'] = this.categoryId;
                huiguPost(function(data){
                    if(data.code == 0){
                        callback&&callback(data.data);
                    }else{
                        utils.Errordata();
                    }
                },huiguPostUrl.getChannelArticle,
                param)
            }
        }
        videoList.init();
    })
})