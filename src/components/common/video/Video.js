var globleHTMLPre = 'text!./components/common/'
define([globleHTMLPre+'video/Video.html','utils','videoJs'],function(html,utils) {
    var Video = function(id,source){
        this.container = document.getElementById(id);

        $(this.container).html(_.template(html) ({source:source}))
    }
    Video.prototype.updateSource = function(source){
        $(this.container).html(_.template(html) ({source:source}))
    }
    return Video;
})