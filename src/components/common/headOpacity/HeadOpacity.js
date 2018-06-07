define(['utils','jquery'],function(utils,$) {
    var HeadOpacity = function(banner,head){
        this.banner = banner;
        this.head = head;
        this.flag = 0;//0代表透明中，1代表白底中
    }
    HeadOpacity.prototype.init = function(callback){
        var _this = this;
        var bannerHeight = this.banner.height()
        var headHeight = this.head.height()||0;
        

        _this.check.call(_this,bannerHeight,headHeight,callback)
        $(window).on('scroll',function(){
            _this.check.call(_this,bannerHeight,headHeight,callback)
        })
    }
    HeadOpacity.prototype.check = function(bannerHeight,headHeight,callback){
        var _this = this;
        var nScrollTop = window.scrollY;
        var h = bannerHeight - headHeight*2;
        if(_this.flag  == 0 && nScrollTop >= h){
            _this.flag  = 1;
            _this.head.removeClass("huigu-header-opaque");
            _this.head.css("opacity","1")
        }
        if(_this.flag == 1 && nScrollTop <= h){
            _this.flag = 0;
            _this.head.addClass("huigu-header-opaque");
            _this.head.css("opacity","1")
        }
        if(nScrollTop >= h){
            var showPersent = (nScrollTop - h)/headHeight;
            if(showPersent < 1){
                _this.head.css("opacity",showPersent)
                callback&&callback(false)
            }else{
                _this.head.css("opacity","1")
                callback&&callback(true)
            }
        }
    }
    return HeadOpacity;
})