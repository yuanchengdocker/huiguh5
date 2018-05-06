var globleHTMLPre = 'text!./components/common/'
define([globleHTMLPre+'courseSeries/CourseSeries.html','utils','swiper'], function(html,utils,Swiper){

    var CourseSeries = function(id,data,swiperIndex){
        this.container = document.getElementById(id);
        data.id = id + 'swiper' + (swiperIndex||0);
        this.data = data;
        this.html = html;
    }
    CourseSeries.prototype.init = function(){

        var ele = _.template(html) ({data:this.data});
        $(this.container).append(ele)
        
        var swiper = new Swiper('#'+this.data.id, {
            slidesPerView : this.data.projectCourseList.length<=3 ? this.data.projectCourseList.length : 3,
            slideToClickedSlide: true,
        });
    }
    CourseSeries.prototype.getHtml = function(){
        return this.html;
    }
    return CourseSeries;
})