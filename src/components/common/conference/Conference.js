var globleHTMLPre = 'text!./components/common/'
define([globleHTMLPre+'conference/Conference.html','utils'], function(html,utils){

    var Conference = function(id,data){
        this.container = document.getElementById(id);
        this.data = data;
    }
    Conference.prototype.init = function(){

        var ele = _.template(html) ({item:this.data});
        $(this.container).append(ele)
        
    }
    return Conference;
})