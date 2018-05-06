define(['utils','jquery','Model'],function(utils,$,Model) {
    var Confirm = function(title,callback){
        return new Confirm.fn.init(title,callback)
    }
    Confirm.fn = Confirm.prototype = {
        init : function(title,callback){
            let self = this;
            let model = new Model();
            let divContainer = utils.createEle('div',{classs:["flup-eject"]})
            this.selfBody = divContainer;
            let content = utils.createEle('div',{classs:["eject-con"]})
            let titlec = utils.createEle('p',{classs:["eject-tit"],text:title})
            let optContainer = utils.createEle('p');
            let cancel = utils.createEle('a',{classs:["cancel"],text:"取消"})
            $(cancel).bind('click',function(){
                model.hide();
            })
            let sure = utils.createEle('a',{classs:["sure"],text:"确定"})
            $(sure).bind('click',function(){
                model.hide();
                callback&&callback();
            })
            optContainer.appendChild(cancel)
            optContainer.appendChild(sure)
            content.appendChild(titlec)
            content.appendChild(optContainer)
            divContainer.appendChild(content)

            model.init(divContainer);
        }
    }
    
    Confirm.fn.init.prototype = Confirm.fn;
    return Confirm;
})