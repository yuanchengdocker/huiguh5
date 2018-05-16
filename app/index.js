import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import createRouter from './config/router'
import store from './store/index'
import './config/eles.config'
import app from './app.vue'
import './style/theme.css'
// import '../src/common/js/flexible'
require("babel-core/register");
require("babel-polyfill");
// import 'lib-flexible/flexible'

// Vue.use(Vuex)
Vue.use(VueRouter)

const router = createRouter()
// const store = createStore()

router.beforeEach((to, from,next) => {
    console.log(to)
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
document.cookie = "IDFA=0; expires=" + dt.toGMTString() + ";path=/";
document.cookie = "apiVer=1; expires=" + dt.toGMTString() + ";path=/";
document.cookie = "appSrc=629; expires=" + dt.toGMTString() + ";path=/";
document.cookie = "appType=9; expires=" + dt.toGMTString() + ";path=/";
document.cookie = "appVer=3.2.0; expires=" + dt.toGMTString() + ";path=/";
document.cookie = "cType=1; expires=" + dt.toGMTString() + ";path=/";
document.cookie = "osUUID=F1899D44FFAEE601BAD5630EB3B80F29; expires=" + dt.toGMTString() + ";path=/";
document.cookie = "osVer=22; expires=" + dt.toGMTString() + ";path=/";
document.cookie = "token=06671900FDC840609A27F2E61F0D1C47; expires=" + dt.toGMTString() + ";path=/";

// document.cookie = "sdktoken=e1e81c1a1696ca9f42d499822d0be9c3; expires=" + dt.toGMTString() + ";path=/";
// document.cookie = "uid=yuancheng520; expires=" + dt.toGMTString() + ";path=/";

document.cookie = "sdktoken=acc9eb19212a0a449476a06cd2f516f3; expires=" + dt.toGMTString() + ";path=/";
document.cookie = "uid=yuancheng521; expires=" + dt.toGMTString() + ";path=/";

// document.cookie = "sdktoken=b6beca98d3177d6ef32a3ed5e2fc8ca9; expires=" + dt.toGMTString() + ";path=/";
// document.cookie = "uid=d696528121913937920; expires=" + dt.toGMTString() + ";path=/";

