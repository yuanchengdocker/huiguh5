require(['../../common/common.js'],function(common){
    require(['utils','Video','swiper','Pullload'],function(utils,Video,Swiper,Pullload) {
        var course = {
            detailIndex:true, //true详情，false评论
            detailContainer:document.getElementById("course-detail-page"),
            commContainer:document.getElementById("course-comm-page"),
            courseId:utils.optUrlParams("courseId")||"",
            projectId:"",
            projectCourseId:utils.optUrlParams("projectCourseId")||"",
            currentPage:1,
            ajaxLock:false,
            init:function(){
                var self = this;
                this.viewInit();
                this.dataInit();
                if(this.projectCourseId){
                    this.getSeries(function(data){
                        if(!data || !data.data || !data.data.courses || data.data.courses.length <= 0) return;

                        $("#series-swiper").html(_.template($("#swiper-container").html()) (data))
                        var mySwiper = new Swiper ('.swiper-container', {
                            slidesPerView : 3,
                            slideToClickedSlide: true,
                        });
                        data.data.courses&&data.data.courses.map(function(item,index){
                            if(item.courseId == data.data.currentCourse.courseId){
                                mySwiper.slideTo(index);
                                $("#series-swiper").find(".series-item").eq(index).addClass("series-active");
                                self.updateTitle(data.data.currentCourse.courseTitle)
                            }
                        })
                        utils.touchTarget(document.getElementsByClassName("swiper-container")[0],null,null,function(e){
                            $(e.target).parents(".series-item").siblings(".series-active").removeClass("series-active")
                            $(e.target).parents(".series-item").addClass("series-active");
                            self.updateTitle($(e.target).parents(".series-item").attr("courseTitle"))

                            var courseId = $(e.target).parents(".series-item").attr("course");
                            if(courseId == self.courseId) return;

                            self.courseId = courseId;
                            self.currentPage = 1;
                            self.getCourse(self.dataInit.bind(self),courseId,self.projectId);
                        })
                        self.projectId = data.data.currentCourse.projectId;
                        self.dataInit(data);
                    });
                }else{
                    this.getCourse(function(data){
                        if(!data || !data.data) return;

                        $("#series-swiper").html(_.template($("#swiper-container").html()) (data))
                        var mySwiper = new Swiper ('.swiper-container', {
                            slidesPerView : 3,
                            slideToClickedSlide: true,
                        });
                        data.data.courses&&data.data.courses.map(function(item,index){
                            if(item.courseId == data.data.currentCourse.courseId){
                                mySwiper.slideTo(index);
                                $("#series-swiper").find(".series-item").eq(index).addClass("series-active");
                                self.updateTitle(data.data.currentCourse.courseTitle)
                            }
                        })
                        utils.touchTarget(document.getElementsByClassName("swiper-container")[0],null,null,function(e){
                            $(e.target).parents(".series-item").siblings(".series-active").removeClass("series-active")
                            $(e.target).parents(".series-item").addClass("series-active");
                            
                            var courseId = $(e.target).parents(".series-item").attr("course");
                            if(courseId == self.courseId) return;

                            self.courseId = courseId;
                            self.currentPage = 1;
                            self.getCourse(self.dataInit.bind(self),courseId,self.projectId);
                        })
                        self.projectId = data.data.currentCourse.projectId;
                        self.dataInit(data);

                    },self.courseId)
                }
                
            },
            updateTitle:function(title){
                document.title = title;
                // var i = document.createElement('iframe');
                // i.src = '../favicon.ico';
                // i.style.display = 'none';
                // i.onload = function() {
                //     setTimeout(function(){
                //         i.remove();
                //     }, 9)
                // }
                // document.body.appendChild(i); 
            },
            viewInit:function(){
                var self = this;
                $(".course-tab-container .course-tab-item").bind('touchstart',function(){
                    if(!$(this).hasClass('course-tab-active')){
                        self.tabChangeFn(!self.detailIndex);
                    }
                })
                utils.touchTarget(document.getElementsByClassName("course-list")[0],function(){
                    if(self.detailIndex) return;
                    self.tabChangeFn(!self.detailIndex);
                },function(){
                    if(!self.detailIndex) return;
                    self.tabChangeFn(!self.detailIndex);
                })
            },
            dataInit:function(data){
                var self = this;
                if(!data || !data.data) return;
                data = data.data.currentCourse;
                (data&&data.videos)&&data.videos.map(function(item,index){
                    item.no = utils.numToChinese(index+1);
                })
                $(".course-detail-list").html(_.template($("#courses-list").html()) ({data:data||{}}))
                $(".bottom-container").html(_.template($("#bottom-container").html()) ({data:data||{}}))

                if(!data || !data.videos || data.videos.length <= 0) return;

                self.courseId = data.courseId;

                $(".course-comm-container").html("");
                var mPullload = new Pullload("course-comms-container",$("#course-comm-container").html(),self.getCommon.bind(self),20);
                mPullload.init();
                utils.pullRefresh($(".course-comm-container")[0],mPullload.init.bind(mPullload));

                // this.commonDataInit()
                // utils.pullRefresh($(".course-comm-container")[0],this.commonDataInit.bind(this))

                if(data.isCharge){
                    $("#course-video").html(_.template($("#course-video-container").html()) ({data:data}))
                }else{
                    var hvideo = new Video("course-video",data.videos[0].videoUrl)
                    $(".detail-list-container").find(".item-title").bind('click',function(){
                        $(".detail-list-container").find(".item-title-active").removeClass("item-title-active")
                        $(this).addClass("item-title-active");
                        hvideo.updateSource($(this).attr("url"))
                    })
                }

            },
            tabChangeFn:function(type){
                let self = this;
                self.detailIndex = type;
                var active = $(".course-tab-active");
                if(self.detailIndex){
                    $(".active-flag").removeClass("tab-turn-right")
                    $(".active-flag").addClass("tab-turn-left")
                }else{
                    $(".active-flag").removeClass("tab-turn-left")
                    $(".active-flag").addClass("tab-turn-right")
                }
                active.siblings(".course-tab-item").addClass('course-tab-active')
                active.removeClass('course-tab-active')
                if(self.detailIndex){//我的问卷,入
                    $(self.detailContainer).parent().removeClass("course-out-left");
                }else{
                    $(self.detailContainer).parent().addClass("course-out-left");
                }
            },
            getSeries:function(callbackD){
                huiguPost(function(data){
                    if(data.code == 0){
                        callbackD&&callbackD(data);
                    }
                },huiguPostUrl.projectLessonView,{projectCourseId:this.projectCourseId})
            },
            getCourse:function(callback,id,projectId){
                var param = { courseId:id };
                if(projectId) param.projectId = projectId;
                huiguPost(function(data){
                    if(data.code == 0){
                        callback&&callback(data);
                    }
                },huiguPostUrl.projectLessonView,param)
            },
            getCommon:function(callback,currentPage){
                huiguPost(function(data){
                    if(data.code == 0){
                        callback&&callback(data.data);
                    }else{
                        utils.Errordata();
                    }
                },huiguPostUrl.queryListUrl,{topicId:this.courseId,currentPage:currentPage,pageSize:20,topicType:2})
            }
         }

         course.init();
    })
})