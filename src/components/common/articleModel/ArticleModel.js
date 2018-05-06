var globleHTMLPre = 'text!./components/common/'
define([globleHTMLPre+'articleModel/ArticleModel.html','utils'], function(html,utils){
  var ArticleModel = function(id,data){
    this.container = document.getElementById(id);
    this.data = data||{
        sourceChannel:'资讯',
        coverUrl:"/build/img/personal_cover.png",
        newsTitle:"骨科病例解析骨科病例病例解析骨科",
        readCount:23,
        praiseCount:1088
    };
  }
  ArticleModel.prototype.init = function(){

      var ele = _.template(html) ({item:this.data});
      $(this.container).append(ele)
  }

  return ArticleModel;

})
