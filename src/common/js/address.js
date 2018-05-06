var basePath = '';
var apiPath = '/thirdpartyapi';
var huiguPostUrl = {

    
    getDoctorUserDetail: basePath + apiPath + '/doctorUser/getDoctorUserDetail', //获取医生信息
    getSerceGroupPageService: basePath + apiPath + '/doctorShare/queryGroup', //分享名医团队交流群
    getDoctorUserService: basePath + apiPath + '/doctorShare/getDoctorUserDetail', //获取医生名片信息

    getServiceApply: basePath + apiPath + '/service/apply', //服务开通申请
    getServiceResult: basePath + apiPath + '/service/select', //服务开通查询订单

    getShare: basePath + apiPath + '/interaction/share/share',//资讯分享
    
    articleDetail: basePath + apiPath + '/college/newsDetail',  //新闻
    getCorrelateRead: basePath + apiPath + '/college/newsCorrelateRead', //文章扩张

    getExpertSummary: basePath + apiPath + '/expert/summary', //专家主页调取-宁方明
    getExpertGroup: basePath + apiPath + '/expert/group', //专家主页的团队列表-宁方明
    getExpertProduction: basePath + apiPath + '/workingGroup/queryProduction', //专家主页的作品列表-宁方明
    getExpertService: basePath + apiPath + '/expert/service', //专家主页的服务列表-宁方明
    
    getDoctorHomeService: basePath + apiPath + '/doctorShare/getDoctorHomePage',  //医生主页
    getQueryDoctorStudio: basePath + apiPath + '/workingGroup/queryDoctorStudio',  //医生主页的团队列表

    
    courseDetail:basePath + apiPath + '/video/video/courseDetail',   //课程详情
    
    queryDoctorStudioMembers:basePath + apiPath + '/workingGroup/queryDoctorStudioMembers',// 工作室成员
    getDoctorStudioSpecificInfo:basePath + apiPath + '/workingGroup/getDoctorStudioSpecificInfo', //工作室详情
    queryService:basePath + apiPath + '/workingGroup/queryService', //工作室服务列表
    querySchemeDetail:basePath + apiPath + '/diseaseSurgery/querySchemeDetail', //手术方案详情


    articleDetail: basePath + apiPath + '/college/newsDetail',  //新闻
    getCorrelateRead: basePath + apiPath + '/college/newsCorrelateRead', //文章扩张
    
    conferenceDetail : basePath + apiPath + '/college/queryConference', //会议详情
    queryListUrl: basePath + apiPath + '/college/commentQueryList', //评论
    projectLessonView:basePath + apiPath + '/college/projectLessonView', //课程专题
    projectDetail:basePath + apiPath + '/college/videoProjectDetail',//
    getChannels : basePath + apiPath + '/college/showChannel',
    getHomeBanner : basePath + apiPath + '/college/queryHomeAdvertisement',
    getCollegeHome : basePath + apiPath + '/college/home',
    getChannelArticle : basePath + apiPath + '/channel/queryChannelArticle',
    getChannelBanner : basePath + apiPath + '/channel/queryAdvertisement',
}


