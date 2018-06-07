require(['../../common/common.js'],function(common){
    require(['utils','Pullload'],function(utils,Pullload) {
        
        var serviceMember = {
            departmentId:"",
            areaId:[],
            ajaxLock:false,
            startIndex:0,
            specialEmpty:$(".special-empty"),
            init:function(){

                serviceMember.getMemberList();
                serviceMember.updata();

                serviceMember.regionData(); //请求区域列表
                serviceMember.departmentData(); //请求科室列表
                
                //隐藏所有
                $(".index-select-detail .disHidden").unbind('click').click(function(){
                  serviceMember.disHiddenInit();
                })

            },
            regionData:function(){
                huiguPost(function(data){
                    if(data.code == 0){
                        $("#regionDetail").html(_.template($("#regionList").html()) (data))
                        $("#areaDetail").html(_.template($("#areaList").html()) (data))
                        
                        //显示区域
                        $(".selectRegion").on("click",function(){
                            serviceMember.RegionInit();
                        })

                        //选取区域
                        $("#regionDetail").on("click","li",function(){
                            var regionliValue = $(this)[0].className;
                            $("#regionDetail li").removeClass("regionActive");
                            $("#areaDetail ul").css("display","none");
                            $(".regionList"+ regionliValue.substr(regionliValue.length-1,1)).addClass("regionActive");
                            $(".areaDetail"+ regionliValue.substr(regionliValue.length-1,1)).css("display","block"); //显示相应的区域
                            $("#areaDetail li").removeClass("areaActive");
                            $("#areaDetail .areaList00").addClass("areaActive");
                        })

                        //选取区域
                        $("#areaDetail").on("click","li",function(){
                            var arealiValue = $(this)[0].className;
                            serviceMember.areaId = [];

                            if(arealiValue.indexOf("00") > 0){
                                $("#areaDetail li").removeClass("areaActive");
                                $("#areaDetail .areaList00").addClass("areaActive");
                                
                                var regionValue = $(this)[0].parentElement.className;
                                $(".selectRegion span").html($(".regionList" + regionValue.substr(regionValue.length-1,1))[0].innerText);

                                var arealiId = $(this).nextAll();
                                for(var i=0;i< arealiId.length;i++){
                                    var arealiData = arealiId[i].attributes[1].nodeValue;
                                    serviceMember.areaId.push(arealiData);
                                }
                                
                            }else{
                                $("#areaDetail li").removeClass("areaActive");
                                $("." + $(this)[0].parentElement.className + " .areaList"+ arealiValue.substring(arealiValue.length-2)).addClass("areaActive");
                                
                                $(".selectRegion span").html($(this)[0].innerText);

                                let arealiId = $(this)[0].attributes[1].nodeValue;
                                serviceMember.areaId.push(arealiId);
                            }
                            

                            //重新请求接口
                            serviceMember.startIndex = 0;
                            serviceMember.getMemberList();
                            serviceMember.updata();
                            serviceMember.disHiddenInit();
                        });
                    }
                },huiguPostUrl.getAreaQueryRegionArea)
            },
            departmentData:function(){
                huiguPost(function(data){
                    if(data.code == 0){
                        $("#departmentDetail").html(_.template($("#departmentList").html()) (data))

                        //显示学科
                        $(".selectDepartment").on("click",function(){
                            serviceMember.DepartmentInit();
                        })

                        //选取学科
                        $("#departmentDetail").on("click","li",function(){
                            var departliValue = $(this)[0].className;

                            $("#departmentDetail li").removeClass("departActive");
                            serviceMember.departmentId = "";
                            if(departliValue.indexOf("00") > 0){
                                serviceMember.departmentId = "";
                                $("#departmentDetail .departlist00").addClass("departActive");
                                $(".selectDepartment span").html("学科");
                            }else{
                                 $(".selectDepartment span").html($(this)[0].innerText);
                                serviceMember.departmentId = $(this)[0].attributes[1].nodeValue;
                                $(".departlist"+ departliValue.substring(departliValue.length-2)).addClass("departActive");
                            }

                            //重新请求接口
                            serviceMember.startIndex = 0;
                            serviceMember.getMemberList();
                            serviceMember.updata();
                            serviceMember.disHidden();

                        })
                    }
                },huiguPostUrl.getDepartmentQueryList,{})
            },
            //初始化进入的样式
            RegionInit:function(){
                $(".select-detail1").css("display","block"); //显示
                $(".select-detail2").css("display","none"); //隐藏
                $(".selectRegion i").addClass("fan");
                //第一次进入的样式
                // $("#regionDetail li").removeClass("regionActive");
                // $("#areaDetail ul").css("display","none");
                // $(".regionList1").addClass("regionActive"); //第一次进入的样式
                // $(".areaDetail1").css("display","block"); //第一次进入的样式
            },
            DepartmentInit:function(){
                $(".select-detail2").css("display","block"); //显示
                $(".select-detail1").css("display","none"); //隐藏
                $(".selectDepartment i").addClass("fan");
                
            },
            disHiddenInit:function(){
                event.preventDefault();
                
                $("html,body").height("auto");  //设置背景不能滚动
                $("html,body").css("overflow","visible"); //设置背景不能滚动滚动

                $(".index-select-top i").removeClass("fan");
                //隐藏区域模块
                $(".select-detail1").css("display","none"); 

                //父列表恢复默认
                // $("#regionDetail li").removeClass("regionActive");
                // $(".regionList1").addClass("regionActive"); //第一次进入的样式
                //子列表
                // $("#areaDetail ul").css("display","none");
                // $(".areaDetail11").css("display","block"); //第一次进入的样式
                //子列表的li
                // $("#areaDetail li").removeClass("areaActive");
                // $("#areaDetail .areaList00").addClass("areaActive");

                //隐藏学科模块
                $(".select-detail2").css("display","none"); //隐藏

            },
            disHidden:function(){
                event.preventDefault();
                
                $("html,body").height("auto");  //设置背景不能滚动
                $("html,body").css("overflow","visible"); //设置背景不能滚动滚动

                $(".index-select-top i").removeClass("fan");
                //隐藏区域模块
                $(".select-detail1").css("display","none"); 

                //隐藏学科模块
                $(".select-detail2").css("display","none"); //隐藏
            },
            getMemberList:function(){
                $("html").height("auto")
                var params = {
                    departmentId:this.departmentId,
                    areaId:this.areaId,
                    startIndex:this.startIndex,
                    pageSize:20
                }
                huiguPost(function(data){
                  serviceMember.ajaxLock = false;
                  $("#member-container").show();
                  if(data.code == 0){
                    var ele =  _.template($("#member-item").html()) (data);
                    if(serviceMember.startIndex == 0){
                        if(data.data == null || data.data == []){
                            serviceMember.ajaxLock = true;
                            $("#member-container").hide();
                            serviceMember.specialEmpty.show();
                        }else{
                            if(data.data.length < params.pageSize){
                                serviceMember.ajaxLock = true;
                            }
                            $("#member-container").html(_.template($("#member-item").html()) (data))
                        }
                    }else{
                        if(data.data.length < params.pageSize || data.data == null || data.data == []){
                            serviceMember.ajaxLock = true;
                            serviceMember.specialEmpty.hide();
                        }
                        $("#member-container").append(ele);
                    }

                  }else{
                    serviceMember.ajaxLock = true;
                    return;
                  }
                  
                  if(serviceMember.startIndex==0&&$(".service-member ul").height() < window.screen.height){
                      $("html").height("100%")
                      $("body").height("100%")
                  }  
                },huiguPostUrl.getExpertList,params)
                // huiguPost(function(data){
                //     if(data.code == 0){
                //         callback&&callback(data.data);
                //     }
                // },huiguPostUrl.getExpertList,params)
            },
            updata:function(){
                window.addEventListener('scroll', function (e) {
                  var wScrollY = window.pageYOffset|| document.documentElement.scrollTop    
                          || document.body.scrollTop    
                          || 0;
                  var wInnerH = window.innerHeight; // 设备窗口的高度（不会变）
                  var bScrollH = document.body.scrollHeight; // 滚动条总高度
                  if (wScrollY + wInnerH >= bScrollH - 100) {
                       if (!serviceMember.ajaxLock) {
                        serviceMember.startIndex = serviceMember.startIndex + 20;
                        serviceMember.getMemberList();  
                        serviceMember.ajaxLock = true;
                      }
                  }
                });
            }

        }
        serviceMember.init();

        
    })
})


