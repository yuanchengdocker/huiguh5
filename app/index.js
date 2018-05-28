import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import createRouter from './config/router'
import store from './store/index'
import './config/eles.config'
import app from './app.vue'
import './style/theme.css'
import '../src/common/js/flexible'
require("babel-core/register");
require("babel-polyfill");

// Vue.use(Vuex)
Vue.use(VueRouter)

const router = createRouter()
// const store = createStore()

router.beforeEach((to, from,next) => {
    let path = to.path
    if(path === '/build/vuepage/session' || path === '/build/vuepage/chat'){
        if(!store.state.myInfo.uid){
            console.log('未登录')
            // return
        }
    }
    store.dispatch('setCurrRoute',to)
    next()
})

new Vue({
    router: router,
    store,
    render: h => h(app)
}).$mount('#root')

var dt = new Date();
dt.setHours(dt.getHours() + 24);
// document.cookie = "IDFA=0; expires=" + dt.toGMTString() + ";path=/";
// document.cookie = "apiVer=1; expires=" + dt.toGMTString() + ";path=/";
// document.cookie = "appSrc=629; expires=" + dt.toGMTString() + ";path=/";
// document.cookie = "appType=9; expires=" + dt.toGMTString() + ";path=/";
// document.cookie = "appVer=3.2.0; expires=" + dt.toGMTString() + ";path=/";
// document.cookie = "cType=1; expires=" + dt.toGMTString() + ";path=/";
// document.cookie = "osUUID=F1899D44FFAEE601BAD5630EB3B80F29; expires=" + dt.toGMTString() + ";path=/";
// document.cookie = "osVer=22; expires=" + dt.toGMTString() + ";path=/";
// document.cookie = "token=06671900FDC840609A27F2E61F0D1C47; expires=" + dt.toGMTString() + ";path=/";

// document.cookie = "sdktoken=e1e81c1a1696ca9f42d499822d0be9c3; expires=" + dt.toGMTString() + ";path=/";
// document.cookie = "uid=yuancheng520; expires=" + dt.toGMTString() + ";path=/";
// localStorage.setItem('sdktoken','e1e81c1a1696ca9f42d499822d0be9c3')
// localStorage.setItem('uid','yuancheng520')

localStorage.setItem('patientImToken','acc9eb19212a0a449476a06cd2f516f3')
localStorage.setItem('patientAccid','yuancheng521')
localStorage.setItem('ofPatientId','7464455396707573761')
localStorage.setItem('mobilePhone','yuancheng521')
localStorage.setItem('iconUrl','https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1526718199&di=f7a5b666e1c02bbce5395ffbd7c7f39b&src=http://pic1.win4000.com/pic/a/e1/7eebfcb75b.jpg')
localStorage.setItem('userType',2)
// document.cookie = "sdktoken=acc9eb19212a0a449476a06cd2f516f3; expires=" + dt.toGMTString() + ";path=/";
// document.cookie = "uid=yuancheng521; expires=" + dt.toGMTString() + ";path=/";

// localStorage.setItem('sdktoken','b5049aa52826447ccb9bba40ad451a06')
// localStorage.setItem('uid','p822561485661147136')
// document.cookie = "sdktoken=b5049aa52826447ccb9bba40ad451a06; expires=" + dt.toGMTString() + ";path=/";
// document.cookie = "uid=p822561485661147136; expires=" + dt.toGMTString() + ";path=/";

// document.cookie = "id=7464455396707573761; expires=" + dt.toGMTString() + ";path=/";
// document.cookie = "userName=袁成test; expires=" + dt.toGMTString() + ";path=/";
// document.cookie = "userAvatar=https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1526718199&di=f7a5b666e1c02bbce5395ffbd7c7f39b&src=http://pic1.win4000.com/pic/a/e1/7eebfcb75b.jpg; expires=" + dt.toGMTString() + ";path=/";
// document.cookie = "userType=2; expires=" + dt.toGMTString() + ";path=/";
