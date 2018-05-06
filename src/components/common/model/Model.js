define(['utils','jquery'],function(utils,$) {
    var Model = function(){
        this.coverId = "edit-cover";
        this.contentId = "edit-model-content";
        this.cover = null;
        this.content = null;
    }
    Model.prototype.init = function(ele){
        let cover = utils.createEle("div",{option:{id:this.coverId}})
        let content = utils.createEle("div",{classs:["hg-alin-center-middle edit-container-show"],option:{id:this.contentId}})
        this.cover = cover;
        this.content = content;
        content.appendChild(ele);
        
        $('body')[0].appendChild(cover);
        $('body')[0].appendChild(content);
        $('body').css("overflow","hidden")

        utils.smartScroll($(cover))
    }
    Model.prototype.getContentContainer = function(){
        return document.getElementById(this.contentId)
    }
    Model.prototype.hide = function(){
        let self = this;
        $(this.cover).addClass("model-cover-opacity");
        $(this.content).removeClass("edit-container-show");
        $(this.content).addClass("edit-container-hidden");

        setTimeout(function(){
            $(self.cover).addClass("model-cover-hide")
            $(self.content).addClass("model-cover-hide")
            $(self.cover).remove();
            $(self.content).remove();
            $('body').css("overflow","")
        },400)
    }

    return Model;
})