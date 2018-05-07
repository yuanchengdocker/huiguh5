//接口地址
var basePath = '';

//新增
var apiPath = '/thirdpartyapi';
var huiguPostUrl = {
    getCaptcha : basePath + apiPath + '/patientUser/getCaptcha', //获取验证码
    getValidatePatientCode : basePath + apiPath + '/patientUser/bindPatientLogin', //验证验证码是否正确
    getLogoutToken : basePath + apiPath + '/patientUser/logoutToken', //退出登录
    getQueryPatient : basePath + apiPath + '/patientUser/queryPatient', //家庭成员列表
    getBindPatientMember : basePath + apiPath + '/patientUser/bindPatientMember', //绑定家庭成员
    getUpdatePatientMemberInfo : basePath + apiPath + '/patientUser/updatePatientMemberInfo', //完善资料、编辑资料
    getPatientDetail : basePath + apiPath + '/patientUser/getPatientDetail', //获取患者基本信息
    getQueryOrder : basePath + apiPath + '/appointmentOrder/queryOrder', //获取我的预约单
    conferenceOrder : basePath + apiPath + '/appointmentOrder/getInvoiceDetail', //获取发票信息
    getApplyInvoice: basePath + apiPath + '/appointmentOrder/applyInvoice', //申请发票
    getDetail: basePath + apiPath + '/appointmentOrder/detail', //查看预约详情
    getThirdPartyUserByOpenId: basePath + apiPath + '/patientUser/getThirdPartyUserByOpenId', //根据openId获取用户信息


    getQRCodeMessage: basePath + apiPath + '/pay/getQRCodeMessage', //获取二维码
    getOrderStatus: basePath + apiPath + '/pay/getOrderStatus', //获取二维码状态，时时刷新
    getUnionPay: basePath + apiPath + '/pay/unionPay', //微信支付以及支付宝支付
    getWechatJSAPIPay: basePath + apiPath + '/pay/wechatJSAPIPay', //二维码微信支付
    getAliWAPPay: basePath + apiPath + '/pay/aliWAPPay', //二维码支付宝支付
    getPayMessage: basePath + apiPath + '/pay/getPayMessage', //二维码支付详情页
    getWeiXinDetail: basePath + apiPath + '/thirdPartyUser/getWeiXinDetail', //获取openId

    getcaptchaurl: basePath + apiPath + '/patientUser/getcaptchaurl', //获取图形验证码
    getCaptchaByte: basePath + apiPath + '/patientUser/getCaptchaByte',

    getDoctorRelation: basePath + apiPath + '/patientUser/bindDoctorRelation', //新增加
    getthirdPartyLogin: basePath + apiPath + '/patientUser/thirdPartyLogin', //授权登录接口

}


// var httpPathch = 'http://ddpay.huiguqx.com/'; //测试环境地址
var httpPathch = 'http://patienth5.szyyky.com/'; //正式环境地址
// var valuePath = 'wxf5bdc71fe3151bc4'; //慧骨健康
var valuePath = 'wx00d754ba950e306a'; //慧骨勤行
var dataPath = {
    WXhttpPathch: httpPathch,
    WXvalueApich: valuePath,
}; 

