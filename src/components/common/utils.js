define(['jquery','address','lodash','commons','flexible'],function($) {
    $(document).ready(function() {
        var dt = new Date();
        dt.setHours(dt.getHours() + 24);
        document.cookie = "IDFA=0; expires=" + dt.toGMTString() + ";path=/";
        document.cookie = "apiVer=0; expires=" + dt.toGMTString() + ";path=/";
        document.cookie = "appSrc=629; expires=" + dt.toGMTString() + ";path=/";
        document.cookie = "appType=9; expires=" + dt.toGMTString() + ";path=/";
        document.cookie = "appVer=3.0.0; expires=" + dt.toGMTString() + ";path=/";
        document.cookie = "cType=1; expires=" + dt.toGMTString() + ";path=/";
        document.cookie = "osUUID=7D3C6F27790D94DCBE2754FFD8B94AD1; expires=" + dt.toGMTString() + ";path=/";
        document.cookie = "osVer=19; expires=" + dt.toGMTString() + ";path=/";
        document.cookie = "token=B763F9FAD0D44EBFB19EBD1742D7C1C2; expires=" + dt.toGMTString() + ";path=/";
        document.cookie = "userRole=1; expires=" + dt.toGMTString() + ";path=/";

        // var dt = new Date();
        // dt.setHours(dt.getHours() + 24);
        // document.cookie = "IDFA=0ED921EB-9B42-4299-83C7-B7F37738B39F; expires=" + dt.toGMTString() + ";path=/";
        // document.cookie = "apiVer=3; expires=" + dt.toGMTString() + ";path=/";
        // document.cookie = "appSrc=910; expires=" + dt.toGMTString() + ";path=/";
        // document.cookie = "appType=9; expires=" + dt.toGMTString() + ";path=/";
        // document.cookie = "appVer=3.0.0; expires=" + dt.toGMTString() + ";path=/";
        // document.cookie = "cType=2; expires=" + dt.toGMTString() + ";path=/";
        // document.cookie = "osUUID=2DF337D4-64CA-4450-92B2-B55BA21C9B2C; expires=" + dt.toGMTString() + ";path=/";
        // document.cookie = "osVer=8.3; expires=" + dt.toGMTString() + ";path=/";
        // document.cookie = "token=7661F5B3241F46FA9824A48B1DFE63AC; expires=" + dt.toGMTString() + ";path=/";
        // document.cookie = "userRole=1; expires=" + dt.toGMTString() + ";path=/";

        // $(document).ready(function() {
        //     var dt = new Date();
        //     dt.setHours(dt.getHours() + 24);
        //     document.cookie = "IDFA=E012F02A-53D3-4271-9EAC-D380EC9ED3B4; expires=" + dt.toGMTString() + ";path=/";
        //     document.cookie = "apiVer=3; expires=" + dt.toGMTString() + ";path=/";
        //     document.cookie = "appSrc=910; expires=" + dt.toGMTString() + ";path=/";
        //     document.cookie = "appType=9; expires=" + dt.toGMTString() + ";path=/";
        //     document.cookie = "appVer=3.0.0; expires=" + dt.toGMTString() + ";path=/";
        //     document.cookie = "cType=2; expires=" + dt.toGMTString() + ";path=/";
        //     document.cookie = "osUUID=F9D571EF-FF81-4FD7-937F-F12977877DAC; expires=" + dt.toGMTString() + ";path=/";
        //     document.cookie = "osVer=9.3.2; expires=" + dt.toGMTString() + ";path=/";
        //     document.cookie = "token=40B2364BC55A4D2CBBFAA80A06805C67; expires=" + dt.toGMTString() + ";path=/";
        //     document.cookie = "userRole=1; expires=" + dt.toGMTString() + ";path=/";
        // });

        // $(document).ready(function() {
        //     var dt = new Date();
        //     dt.setHours(dt.getHours() + 24);
        //     document.cookie = "IDFA=F851BB81-4BC7-4FD6-95C4-EDC760FBEA48; expires=" + dt.toGMTString() + ";path=/";
        //     document.cookie = "apiVer=3; expires=" + dt.toGMTString() + ";path=/";
        //     document.cookie = "appSrc=910; expires=" + dt.toGMTString() + ";path=/";
        //     document.cookie = "appType=9; expires=" + dt.toGMTString() + ";path=/";
        //     document.cookie = "appVer=3.0.0; expires=" + dt.toGMTString() + ";path=/";
        //     document.cookie = "cType=2; expires=" + dt.toGMTString() + ";path=/";
        //     document.cookie = "osUUID=BAD50003-08D2-4082-9244-A165C1DD50DE; expires=" + dt.toGMTString() + ";path=/";
        //     document.cookie = "osVer=10.0; expires=" + dt.toGMTString() + ";path=/";
        //     document.cookie = "token=C37E23419A874F098BE3538234E2B2B0; expires=" + dt.toGMTString() + ";path=/";
        //     document.cookie = "userRole=1; expires=" + dt.toGMTString() + ";path=/";
        // });
    });
    let utils = {
        showLoading:function(container){
            var loading = utils.createEle('div',{classs:['loading',"hg-loading"]})
            var p = utils.createEle('p',{text:"加载中..."})
            var bigImg = utils.createEle("img");
            bigImg.src="../../../img/loading.gif"; 
            loading.appendChild(bigImg);
            loading.appendChild(p);
            $(container||"body").append(loading);
            var loadingObj = {
                finish:function(){
                    $(loading).find("p").text("到底了！");
                    $(bigImg).remove();
                },
                remove:function(){
                    $(loading).remove();
                }
            };

            return loadingObj;
        },
        funTransitionHeight:function(element, time) { // time, 数值，可缺省
            if (typeof window.getComputedStyle == "undefined") return;
            
            var height = window.getComputedStyle(element).height;
        
            element.style.transition = "none";  
           
            element.style.height = "auto";
            var targetHeight = window.getComputedStyle(element).height;
            element.style.height = height;
            // element.offsetWidth = element.offsetWidth;
            if (time) element.style.transition = "height "+ time +"ms";
            element.style.height = targetHeight;
        },
        pullRefresh:function(container,callback){
            var startX, startY, moveEndX, moveEndY, X, Y,isMove,canFresh,isFresh;   
            var m = this.createEle('p',{text:"下拉刷新",option:{style:"height:35px;text-align: center;"}});
            if($(container).children().length > 0){
                $(m).insertBefore($(container).children().eq(0));
            }else{
                $(container).append(m);
            }
            $(container).css("margin-top","-35px")
            $(container).addClass("hg-pull-refresh")


            var startY = 0; // 初始位置
            var lastY = 0; // 上一次位置

            var lastMoveTime = 0;
            var lastMoveStart = 0;
            var stopInertiaMove = false; // 是否停止缓动
            container.addEventListener('touchstart', function(e) {
                lastY = startY = e.touches[0].pageY;
                lastMoveStart = lastY;
                lastMoveTime = e.timeStamp || Date.now();
                stopInertiaMove = true;
            });
            container.addEventListener('touchmove', function(e) {
                var nowY = e.touches[0].pageY;
                var moveY = nowY - lastY;
                var nScrollTop = container.scrollTop;
                var nScrollHight = container.scrollHeight;
                if (moveY > 0 && nScrollTop == 0 && stopInertiaMove) { 
                    var contentTop = $(container).css("margin-top").replace('px', '');
                    if(parseInt(contentTop) + moveY >= 10){
                        $(m).text("释放刷新")
                        canFresh = true;
                    }else{
                        $(m).text("下拉刷新")
                        canFresh = false;
                    }
                    $(container).css("margin-top",(parseInt(contentTop) + moveY) + 'px');
                    lastY = nowY;

                    var nowTime = e.timeStamp || Date.now();
                    stopInertiaMove = true;
                    if(nowTime - lastMoveTime > 300) {
                        lastMoveTime = nowTime;
                        lastMoveStart = nowY;
                    }
                    e.preventDefault();
                }
            });
            container.addEventListener('touchend', function(e) {
                var nowY = e.changedTouches[0].pageY;
                var moveY = nowY - lastY;
                var contentTop = $(container).css("margin-top").replace('px', '');
                var contentY = (parseInt(contentTop) + moveY);
                $(container).css("margin-top",contentY + 'px');
                lastY = nowY;

                var nowTime = e.timeStamp || Date.now();
                var v = (nowY - lastMoveStart) / (nowTime - lastMoveTime); //最后一段时间手指划动速度
                stopInertiaMove = false;
                (function(v, startTime, contentY) {
                    var dir = v > 0 ? -1 : 1; //加速度方向
                    var deceleration = dir*0.0006;
                    var duration = v / deceleration; // 速度消减至0所需时间
                    var dist = v * duration / 2; //最终移动多少
                    function inertiaMove() {
                        if(stopInertiaMove) return;
                        var nowTime = e.timeStamp || Date.now();
                        var t = nowTime-startTime;
                        var nowV = v + t*deceleration;
                        // 速度方向变化表示速度达到0了
                        if(dir*nowV <= 0) {
                            if(canFresh){
                                $(container).css("margin-top","0")
                                $(m).text("正在加载...")
                                isFresh = true;
                                callback&&callback(function(){
                                    $(container).css("margin-top","-35px")
                                    $(m).text("下拉刷新")
                                    canFresh = false;
                                    isFresh = false;
                                    $(container).empty();
                                    $(container).append(m);
                                })
                            }else{
                                $(container).css("margin-top","-35px")
                                $(m).text("下拉刷新")
                            }
                            return;
                        }
                        var moveY = (v + nowV)/2 * t;
                        $(container).css("margin-top",(contentY + moveY) + "px");
                        setTimeout(inertiaMove, 10);
                    }
                    inertiaMove();
                })(v, nowTime, contentY);
            });
        },
        touchTarget:function(container,leftCallBack,RightCallBack,clickCallBack){
            var startX, startY, moveEndX, moveEndY, X, Y,isMove;   

            container.addEventListener('touchstart', function(e) {
                X = 0;
                Y = 0;
                startX = e.touches[0].pageX;
                startY = e.touches[0].pageY;
            });
            container.addEventListener('touchmove', function(e) {
                moveEndX = e.changedTouches[0].pageX;
                moveEndY = e.changedTouches[0].pageY;
                X = moveEndX - startX;
                Y = moveEndY - startY;
                if ( X < -60 ) { RightCallBack&&RightCallBack();e.preventDefault(); }
                else if ( X > 60 ) { leftCallBack&&leftCallBack();e.preventDefault(); }
            });
            container.addEventListener('touchend', function(e){
                if((!X && !Y) || (Math.abs(X) < 60 && Math.abs(Y) < 60)){
                    clickCallBack&&clickCallBack(e);
                }
            })
        },
        smartScroll:function(container, selectorScrollable) {
            // 如果没有滚动容器选择器，或者已经绑定了滚动时间，忽略
            if (container.data('isBindScroll')) {
                return;
            }
            // 是否是搓浏览器
            // 自己在这里添加判断和筛选
            var isSBBrowser;
            var data = {
                posY: 0,
                maxscroll: 0
            };
            // 事件处理
            container.on({
                touchstart: function (event) {
                    var events = event.touches[0] || event;
                    // 先求得是不是滚动元素或者滚动元素的子元素
                    var elTarget = $(event.target);
        
                    if (!elTarget.length) {
                        return;    
                    }
                    var elScroll;
                    // 获取标记的滚动元素，自身或子元素皆可
                    if (elTarget.is(selectorScrollable)) {
                        elScroll = elTarget;
                    } else if ((elScroll = elTarget.parents(selectorScrollable)).length == 0) {
                        elScroll = null;
                    }
                    if (!elScroll) {
                        return;
                    }
                    // 当前滚动元素标记
                    data.elScroll = elScroll;
                    // 垂直位置标记
                    data.posY = events.pageY;
                    data.scrollY = elScroll.scrollTop();
                    // 是否可以滚动
                    data.maxscroll = elScroll[0].scrollHeight - elScroll[0].clientHeight;
                },
                touchmove: function () {
                    // 如果不足于滚动，则禁止触发整个窗体元素的滚动
                    if (data.maxscroll <= 0 || isSBBrowser) {
                        // 禁止滚动
                        event.preventDefault();
                    }
                    // 滚动元素
                    var elScroll = data.elScroll;
                    if(!elScroll) return;
                    // 当前的滚动高度
                    var scrollTop = elScroll.scrollTop();
        
                    // 现在移动的垂直位置，用来判断是往上移动还是往下
                    var events = event.touches[0] || event;
                    // 移动距离
                    var distanceY = events.pageY - data.posY;
                    // 上下边缘检测
                    if (distanceY > 0 && scrollTop == 0) {
                        // 往上滑，并且到头
                        // 禁止滚动的默认行为
                        event.preventDefault();
                        return;
                    }
                    // 下边缘检测
                    if (distanceY < 0 && (scrollTop + 1 >= data.maxscroll)) {
                        // 往下滑，并且到头
                        // 禁止滚动的默认行为
                        event.preventDefault();
                        return;
                    }
                    if (true) {
                        elScroll.scrollTop(data.scrollY - distanceY);
                        elScroll.trigger('scroll');
                        // event.preventDefault();
                        return;
                    }
                },
                touchend: function () {
                    data.maxscroll = 0;
                }    
            });
        
            // 防止多次重复绑定
            container.data('isBindScroll', true);
        },
        createEle:function(type,params){
            if(!type) return;
            let ele = document.createElement(type);
            if(!params) return ele;

            let classs = params.classs;
            if(classs&&classs instanceof Array&&classs.length>0){
                ele.setAttribute("class",classs.join(" "))
            }
            let option = params.option;
            if(option&&option instanceof Object){
                for(let key in option){
                    ele.setAttribute(key,option[key])
                }
            }
            let text = params.text;
            if(text&&typeof text == "string"){
                ele.innerHTML = text;
            }

            return ele;
        },
        isEmpty:function(value){
            if(value == null || typeof value == "undefined" || value == "") return true;
            return false;
        },
        numToChinese:function(num){
            var number = 90;
            var N = [
                "零", "一", "二", "三", "四", "五", "六", "七", "八", "九"
            ];
            var M = [
                "十","百","千","万"
            ]
            var str = num.toString();
            var len = num.toString().length;
            var C_Num = [];
            for(var i = 0; i < len; i++){
                var index = len - i -2;
                if(len == 1 || i != len-1 || str.charAt(i) != "0"){
                    C_Num.push(N[str.charAt(i)]);
                }
                if(index>=0 && str.charAt(i) != "0"){
                    C_Num.push(M[index])
                }
            }
            return C_Num.join('');
        },
        optUrlParams:function(name){
            var search = window.location.search;
            if(this.isEmpty(search)) return null;
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
            var r = search.split("?")[1].match(reg);  
            if (r != null) return decodeURIComponent(r[2]);  
            return null;  
        },
        buildBackto:function(url,id){
            return location.origin+`/build/components/general/${url}.html`+(id?`?questionnaireTemplateId=${id}`:"")
        },
        deepCopy:function(o,c){
            var c = c || {}
            for(var i in o){
                if(typeof o[i] === 'object'){
                        //要考虑深复制问题了
                    if(o[i] == null){
                        c[i] = null;
                    }else{
                        if(o[i].constructor === Array){
                        //这是数组
                            c[i] =[]
                        }else{
                            //这是对象
                            c[i] = {}
                        }
                    }
                    this.deepCopy(o[i],c[i])
                }else{
                    c[i] = o[i]
                }
            }
            return c
        },
        objCmp:function( x, y ) { 
            if ( x === y ) { 
                return true; 
            } 
            if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) { 
                return false; 
            } 
            if ( x.constructor !== y.constructor ) { 
                return false; 
            } 
            for ( var p in x ) { 
                if ( x.hasOwnProperty( p ) ) { 
                    if ( ! y.hasOwnProperty( p ) ) { 
                        return false; 
                    } 
                    if ( x[ p ] === y[ p ] ) { 
                        continue; 
                    } 
                    if ( typeof( x[ p ] ) !== "object" ) { 
                        return false; 
                    } 
                    if ( ! this.objCmp( x[ p ], y[ p ] ) ) { 
                        return false; 
                    }   
                } 
            } 
            for ( p in y ) { 
                if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) { 
                    return false; 
                } 
            } 
            return true; 
        },
        formatDateTime:function(time){
            var date = new Date(time);
            if(time == undefined || null == time || "" == time){
                return "";
            }
            var y = date.getFullYear();  
            var m = date.getMonth() + 1; 
            m = m < 10 ? ('0' + m) : m;  
            var d = date.getDate();  
            d = d < 10 ? ('0' + d) : d;  
            var h = date.getHours();  
            h = h < 10 ? ('0' + h) : h; 
            var minute = date.getMinutes();  
            minute = minute < 10 ? ('0' + minute) : minute;  
            return y + '-' + m + '-' + d;  
        },
        formatMsgTime:function(timespan){

            var dateTime = new Date(timespan);
            var year = dateTime.getFullYear();
            var month = dateTime.getMonth() + 1;
            var day = dateTime.getDate();
            var hour = dateTime.getHours();
            var minute = dateTime.getMinutes();
            var second = dateTime.getSeconds();
            var now = new Date();
            var now_new = Date.parse(now);  //typescript转换写法
            
            var milliseconds = 0;
            var timeSpanStr;
            
            milliseconds = now_new - timespan;
            
            if (milliseconds <= 1000 * 60 * 1) {
                timeSpanStr = '刚刚';
            }
            else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
                timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
            }
            else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
                timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
            }
            else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 30) {
                timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
            }
            else if (1000 * 60 * 60 * 24 * 30 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 30 * 12) {
                timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24 * 30)) + '月前';
            }
            else if (milliseconds > 1000 * 60 * 60 * 24 * 30 * 12 && year == now.getFullYear()) {
                timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
            } else {
                timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
            }
            return timeSpanStr;

        },
        Errordata:function(){
            //错误界面
            var ErrorStr = '<img src="/build/img/error.png" alt="" /><p>暂无网络</p>';
            var ErrorEle = document.createElement('div');
            ErrorEle.className = 'error';
            ErrorEle.id = 'error';
            ErrorEle.innerHTML = ErrorStr;
            // 插入页面
            $(".comment-box").append(ErrorEle);
        
           $("#error").on('click', function(){
             window.location.reload();
           })
        }
    }
    return utils;
});