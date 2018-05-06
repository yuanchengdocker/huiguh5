require.config({
    baseUrl:'/build',
    paths: {
        address: 'common/js/address',
        lodash: 'common/js/lodash',
        jquery: 'common/js/jquery.min',
        commons: 'common/js/common',
        flexible: 'common/js/flexible',
        swiper: 'common/js/swiper.min',
        videoJs: 'common/js/video.min',
        utils: 'components/common/utils.js',

        ReplyCard: 'components/common/replyCard/ReplyCard.js',
        EditCard: 'components/common/editCard/EditCard.js',
        EditPage: 'components/common/editPage/EditPage.js',
        Confirm: 'components/common/confirm/Confirm.js',
        Model: 'components/common/model/Model.js',
        Video: 'components/common/video/Video.js',
        Banner: 'components/common/banner/Banner.js',
        Pullload: 'components/common/pullload/Pullload.js',
        CourseSeries: 'components/common/courseSeries/CourseSeries.js',
        Conference: 'components/common/conference/Conference.js',
        ArticleModel: 'components/common/articleModel/ArticleModel.js',
    },
    map: {
        '*': {
            'css': 'common/js/css',
            'text': 'common/js/text'
        }
    },
    shim : {
        'utils' : ['css!common/css/public/public.css','css!common/css/base.css'],
        'ReplyCard': ['css!components/common/replyCard/ReplyCard.css'],
        'EditCard': ['css!components/common/editCard/EditCard.css'],
        'EditPage': ['css!components/common/editPage/EditPage.css'],
        'Confirm': ['css!components/common/confirm/Confirm.css'],
        'Model': ['css!components/common/model/Model.css'],
        'Video': ['css!components/common/video/Video.css'],
        'Banner': ['css!components/common/banner/Banner.css'],
        'Pullload': ['css!components/common/pullload/Pullload.css'],
        'CourseSeries': ['css!components/common/courseSeries/CourseSeries.css'],
        'Conference': ['css!components/common/conference/Conference.css'],
        'ArticleModel': ['css!components/common/articleModel/ArticleModel.css'],
        'videoJs': ['css!common/css/video-js.min.css']
    }
});