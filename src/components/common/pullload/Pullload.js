define(['utils'],function(utils) {
    var Pullload = function(id,html,service,pageSize,databack,scrollObj){
        this.container = document.getElementById(id);
        this.startIndex = 0;
        this.pageSize = pageSize;
        this.service = service;
        this.html = html;
        this.ajaxLock = false;
        this.databack = databack;
        this.loading = null;
        this.scrollObj = scrollObj;
    }
    Pullload.prototype.init = function(callback){
        this.startIndex = 0;
        var self = this;
        self.showLoading();
        this.service(this.addSource.bind(this,callback),this.startIndex);
        var scrollObj = this.scrollObj ;
        $(scrollObj||this.container).on('scroll', function (e) {
            var nDivHight = $(self.container).height();
            var nScrollHight = $(this)[0].scrollHeight;
            var nScrollTop = $(this)[0].scrollTop;

            if(scrollObj){
                nDivHight = window.innerHeight;
                nScrollHight = document.body.scrollHeight;
                nScrollTop = window.scrollY;
            }

            if (nScrollHight - (nScrollTop + nDivHight) < 100) {
                if (!self.ajaxLock) {
                    self.startIndex = self.startIndex + 1;

                    self.showLoading();
                    self.service(self.addSource.bind(self,callback),self.startIndex);  
                    self.ajaxLock = true;
                }
            }
        });
    }
    Pullload.prototype.showLoading = function(){
        if(!this.loading){
            this.loading = utils.showLoading(this.scrollObj?null:this.container);
        }

    },
    Pullload.prototype.addSource = function(callback,data){
        var ele;
        callback&&callback();
        if(!data  || data.length <= 0){
            this.ajaxLock = true;
            if(this.startIndex > 0){
                this.loading.finish();
            }else{
                this.loading.remove();
            }
            if(this.startIndex == 0){
                this.loading.remove();
                var empty = utils.createEle('div',{classs:['empty']})
                var img = utils.createEle('img',{option:{src:"/build/img/empty.png"}})
                var p = utils.createEle('p',{text:"暂无内容"})
                empty.appendChild(img)
                empty.appendChild(p)
                ele = empty;
                $(this.container).append(ele)
                $(".empty").css("display","block");
            }
        }else{
            this.ajaxLock = false;
            this.loading.remove();
            if(data.length < this.pageSize) {
                this.ajaxLock = true;
            }else{
                this.loading = null;
            }

            if(this.databack){
                this.databack(data);
            }else{
                ele = _.template(this.html) ({data:data});
                $(this.container).append(ele)
            }
            if(data.length < this.pageSize && this.startIndex > 0) {
                this.loading = utils.showLoading(this.scrollObj?null:this.container);
                this.loading.finish();
            }

        }
    }
    return Pullload;
})