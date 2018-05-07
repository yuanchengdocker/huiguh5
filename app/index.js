import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import createRouter from './config/router'
import store from './store/index'
import './config/eles.config'
import app from './app.vue'
import './style/theme.css'

// Vue.use(Vuex)
Vue.use(VueRouter)

const router = createRouter()
// const store = createStore()

router.beforeEach((to, from,next) => {
    console.log(to)
    next()
})

new Vue({
    router: router,
    store,
    render: h => h(app)
}).$mount('#root')