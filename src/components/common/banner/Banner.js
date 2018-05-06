var globleHTMLPre = 'text!./components/common/'
define([globleHTMLPre+'banner/Banner.html','utils','swiper'], function(html, utils,Swiper) {
    'use strict';
    
    var Banner = function(id,datas){
        this.container = document.getElementById(id);
        //this.datas = (!datas||datas.length<=0) ? [{itemLinkURL:"",imageUrl:"/build/img/img.png"}] : datas;
    }
    Banner.prototype.init = function(){
        if(!this.datas || this.datas.length <= 0) return;
        $(this.container).html(_.template(html) ({datas:this.datas}))

        var swiper = new Swiper('#banner-swiper-container', {
            autoplay : 3000,
            autoplayDisableOnInteraction : false,
            pagination : '#banner-swiper-pagination'
        });
    }
    Banner.prototype.update = function(datas){
        if(!datas || datas.length <= 0) return;
        $(this.container).html(_.template(html) ({datas:datas}))

        var swiper = new Swiper('#banner-swiper-container', {
            autoplay : 3000,
            autoplayDisableOnInteraction : false,
            pagination : '#banner-swiper-pagination'
        });
    }

    return Banner;
});