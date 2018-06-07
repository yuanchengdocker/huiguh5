/*! 这是资讯文章 */
;(function(){

  var article_com = $("#container .article_com"),
     article_item = $("#container .article_item");

  var currentPage = 1;  //页码
  var ajaxLock = false; //请求锁

  var isAndroid = false;
  
  // 获取用户的userid
  $.getUrlParam = function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURIComponent(r[2]);
      return null;
  };
  window.localStorage.integral_mall_userId  = newsId;  //本地存储userID到localStorage
  var newsId = $.getUrlParam('newsId'); //新闻id

  //资讯点赞动作以及收藏
  article_com.on('touchstart', '.give', function() {
    var t = $(this),
        img = t.children('.give-img'),
        num = t.children('.num'),
        praiseAdd = parseInt(num.html()) + 1;

    if(img.hasClass('give-img-active')){
        toast("您已经赞过");
        return;
    }else{
      //返回点赞数据给服务
      huiguPost(function(data){
        num.html(countData(praiseAdd));
        img.addClass('give-img-active');
        setToast3("点赞成功");
      },huiguPostUrl.praiseAddData,{topicId : newsId,topicType: 3})
    }
  })
  
  //资讯接口调用
  huiguPost(function(data){
    if(data.code == 0){
      var detailData = data.data;
      var newsTit = detailData.newsTitle;
      detailData.publishDateTime = formatDateTime(detailData.publishDateTime);  //转换long时间为date类型

      // if(GetLength(detailData.author) > 15){
      //    detailData.author = cutstr(detailData.author, 15);
      // }

      $('.newsTitle').html(detailData.newsTitle); //title
      var fuTitlte = "<span style='position:absolute;top:0px;left:0'>" +detailData.publishDateTime + "</span> <span style='width:5.25rem;display:inline-block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;margin-left:2.35rem;'>作者:" + detailData.author + "</span>";
      $('.ar-info .fl').html(fuTitlte); //副标题title
      $('.ar-info .fr').append(detailData.readCountTag); //副标题title
      if (data.data.newsContent.indexOf("<embed") > 0) {
        insetHTML(data.data.newsContent); //展示页面
      } else {
        $('.ar-cont').html(data.data.newsContent);
      }
      
      pullUp($(".c-list")); //加载更多

      //判断是资讯还是病例
      if(detailData.newsType == 4 && detailData.documentAddress != "" && detailData.documentAddress != null && detailData.documentAddress != undefined){
        $(".ar-wku").css("display","block");
        $('.ar-wku .wenBtn').attr('href',detailData.documentAddress);
      }
    }else if(data.code == 35003){
      Errordata3();
    }

  },huiguPostUrl.articleDetail,{newsId : newsId})

  function insetHTML(str){
    var html = "";
    var reg = new RegExp(/<script\s*type=\"text\/javascript\">\s*if\s*\(browser\.versions\.ios\)\s*{\s*document\.writeln\(\'(\<[\w|\W|\s]*\/\>\'\)\;)\s*\}\s*else\s*\{document\.writeln\(\'(\<[\s|\w|\W]*a\>\')\)\;\s*\}\s*<\/script>/);
    
    var m_str = str.match(reg);
    
    //match得到的值应该是
    //[
    //  0: 被匹配中的str
    //  1:"<embed  class="edui-faked-video" pluginspage="http://www.macromedia.com/go/getflashplayer" src="https://v.qq.com/x/page/u0505aa9cb8.html&isAutoPlay=false&hk-healer-video=true" width="420" height="280" style="float:none" wmode="transparent" play="true" loop="false" menu="false" allowscriptaccess="never" allowfullscreen="true" />');"
    //  2:<a href="https://v.qq.com/x/page/u0505aa9cb8.html&isAutoPlay=false&hk-healer-video=true"><img style="width: 300px; height: 169px;" alt="" src="http://storage2.hk515.net/group1/M04/0B/04/ooYBAFbPueaATu1bAAAgIeexBqU320.jpg"/></a>'"
    // index:5647
    // input: 全部的str
    //]
    
    
    
    if(m_str == null){
      $('.ar-cont').html(str);
      return false;
    }
    
    
    //这里使用了 slice 是因为正则表达式拆分不干净，所以需要把末尾多余的字符剪切一下
    if(isAndroid){
      //跳转链接
      html = str.replace(reg,m_str[2].slice(0,-1));
    }else{
      //播放视频
      html = str.replace(reg,m_str[1].slice(0,-3));
    }

    if(navigator.userAgent.match(/android/i)){
      $(".ar-cont").css("overflow-x","hidden");
    };
    
    $('.ar-cont').html(html);

  }
 
 //相关资讯,病例，指南，文库
  huiguPost(function(data){
    if(data.code == 0){
      if(data.data.length > 0){
        $(".relevant-com").html(_.template($("#template-article").html()) (data))
      }else{
        $(".article_add").css("display","none");
      }
    }else{
      $(".article_add").css("display","none");
    }
  },huiguPostUrl.getCorrelateRead,{newsId: newsId})


  //评论点赞
  article_item.on('touchstart', '.give', function() {  //用户点赞
    var t = $(this),
        commentId = t.parent().attr("data-commentid"),
        img = t.children('.give-img'),
        num = t.children('.num'),
        praiseAdd = parseInt(num.html()) + 1;

    //用户评论点赞
    if(img.hasClass('give-img-active')){
        alert("您已点赞过");
        return;
    }else{
      num.html(countData(praiseAdd));
      img.addClass('give-img-active');
    }
 })
  //评论接口调用
  function getData(){
    var userData = {
     topicType: 3,
     topicId: newsId,
     currentPage: currentPage,
     pageSize:20
    };
    $.ajax({
      url: huiguPostUrl.queryListUrl,
      type: 'post',
      datatype: 'json' ,
      contentType: 'application/json',
      data: JSON.stringify(userData),
      success: function(data){
        if(data.code == 0){
          var detailData = data.data;  //数据赋值
          if(detailData != null){
            for(var i=0; i< detailData.length; i++){  //遍历数据
              if(typeof detailData[i] == "object"){
                detailData[i].createTime = getDateDiff(detailData[i].createTime); //转换long时间为date类型
                detailData[i].praiseNum = countData(detailData[i].praiseNum); //点赞数超过10000的显示10000+
              }
            }
            var dataLength = detailData.length; //单页的数据总量
            ajaxLock = false;
            if (dataLength == 0) { //当数据为零的情况下，数据锁住，不加载，跳出循环
              ajaxLock = true;
              if(currentPage == 1){
                $(".empty").css("display","block");
              }
              $("#pullUp").css("display","none");
              return;
            }
            if (dataLength > 0) { //当数据不为零的情况下，数据循环加载
              $("#pullUp").css("display","block");
              $(".empty").css("display","none");
              // currentPage++;
              if (dataLength < 20) { //当数据不为零的情况下再小于20，说明数据加载全部，数据锁住
                ajaxLock = true;
                $("#pullUp").css("display","none");
              }

              var ele =  _.template($("#comment").html()) (data);
              article_item.append(ele);
            }
            // article_item.html(_.template($("#comment").html()) (data));
          }else{
            $(".empty").css("display","block");
          }
        }
        else{
          ajaxLock = true;
        }
      },
      error: function(){
        alert("请求错误，请稍后重试");
      }
    })
  }

  getData();

  //数据循环加载
 $("#container").on('scroll', function (e) {
    var wScrollY = window.pageYOffset|| document.documentElement.scrollTop    
                || document.body.scrollTop    
                || 0;
    var wInnerH = window.innerHeight; // 设备窗口的高度（不会变）
    var bScrollH = document.body.scrollHeight; // 滚动条总高度
    if (wScrollY + wInnerH >= bScrollH - 100) {
         if (!ajaxLock) {
          currentPage = currentPage + 1;
          getData();  
          ajaxLock = true;
        }
    }
  });

  //请求错误处理
  function Errordata(){
    //错误界面
    var ErrorStr = '<img src="/build/img/error.png" alt="" /><p>暂无网络</p>';
    var ErrorEle = document.createElement('div');
    ErrorEle.className = 'error';
    ErrorEle.id = 'error';
    ErrorEle.innerHTML = ErrorStr;
    // 插入页面
    $(".article_item").hide();
    $(".article_com").hide();
    $("#container").append(ErrorEle);
  }

  //删除文章
  function Errordata3(){
    //错误界面
    var ErrorStr = '<img src="/build/img/empty.png" alt="" /><p>该资讯已下线</p>';
    var ErrorEle = document.createElement('div');
    ErrorEle.className = 'error';
    ErrorEle.id = 'error';
    ErrorEle.innerHTML = ErrorStr;
    // 插入页面
    $(".article_item").hide();
    $(".article_com").hide();
    $("#container").append(ErrorEle);
   $("#error").on('click', function(){
     window.location.reload();
   })
  }
})(window, window.lib||(window.lib = {}));