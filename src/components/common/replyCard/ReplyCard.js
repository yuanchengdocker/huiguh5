define(['utils','jquery','Model'],function(utils,$,Model) {
    var ReplyCard = function(id,coverId,topic){
        this.id = id;
        this.coverContainer = document.getElementById(coverId);
        this.sortNo = topic.sortNo;
        this.type = topic.type;
        this.titleP = null;
        this.topicId = topic.topicId;
        this.answerContent = topic.answerContent;
        this.sectionContainer = id&&document.getElementById(id);
        this.title = topic.title||"";
    }
    ReplyCard.prototype.optSortNo=function(flag){
        this.sortNo = this.sortNo+flag;
        $(this.titleP).text(this.sortNo+"、"+this.title)
    }
    ReplyCard.prototype.getSortNo=function(){
        return this.sortNo;
    }
    ReplyCard.prototype.init=function(){
        let self = this;
        this.sectionContainer.innerHTML = "";
        let divContainer = utils.createEle('div',{classs:["replay-card-container"]})
        let spanNo = utils.createEle('span',{text:this.sortNo+"、",classs:["question-card-no"]})
        divContainer.appendChild(spanNo)

        let titleP = utils.createEle('p',{text:this.title,classs:["replay-card-title hg-mb40"]})
        this.titleP = titleP;
        divContainer.appendChild(titleP)
        let sectionDiv = utils.createEle('div',{classs:["replay-card-section hg-pl40"]})
        let ansInput = utils.createEle('textarea',{classs:["replay-card-textarea"],option:{disabled:'disabled'}})
        sectionDiv.appendChild(ansInput)
        divContainer.appendChild(sectionDiv)

        this.sectionContainer.appendChild(divContainer);
    }
    ReplyCard.prototype.showEdit=function(callback){
        let self = this;
        let tempTitle = this.title;

        let model = new Model();

        let divContainer = utils.createEle('div',{classs:["reply-edit-card-container hg-clear"]})
        let cancel = utils.createEle('a',{classs:["reply-card-cancel hg-mt20 hg-mb40"],text:"取消"})
        $(cancel).bind('click',function(){
            model.hide()
        })
        let submit = utils.createEle('a',{classs:["reply-card-submit hg-mt20 hg-mb40"],text:"完成"})
        $(submit).bind('click',function(){
            if(!tempTitle){
                setToast3("问答题标题不能为空！")
                return;
            }
            model.hide()
            callback&&callback({sortNo:self.sortNo,title:tempTitle,type:1,topicDetailList:[],answerContent:self.answerContent,topicId:self.topicId})
        })
        
        divContainer.appendChild(submit)
        divContainer.appendChild(cancel)
        let titleIn = utils.createEle('textarea',{classs:["reply-card-title hg-mb40"],option:{value:tempTitle,maxlength:50,placeholder:"请输入问答题标题"},text:tempTitle})
        $(titleIn).bind('input porpertychange',function(e){
            tempTitle = e.target.value;
        })
        divContainer.appendChild(titleIn)


        model.init(divContainer)
        utils.smartScroll($(model.getContentContainer()));
    }
    
    return ReplyCard;
})