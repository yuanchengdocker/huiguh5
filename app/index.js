import Vue from 'vue'
import VueRouter from 'vue-router'
import createRouter from './config/router'
import './config/eles.config'
import app from './app.vue'
import './style/globel.styl'
import './style/theme.css'
import {Drawer,Icon,Group, Cell, XHeader, XInput, XTextarea, XButton, XSwitch, Datetime, ViewBox, Search, ButtonTab, ButtonTabItem, Divider, Actionsheet, AlertPlugin, ConfirmPlugin} from 'vux'
import ToastPlugin from './plugins/toastPlugin'
import VueTouch from './plugins/touchEvent'
Vue.use(VueTouch)
// 全局注册vux的组件
Vue.component('Group', Group)
Vue.component('Cell', Cell)
Vue.component('Datetime', Datetime)
Vue.component('ButtonTab', ButtonTab)
Vue.component('ButtonTabItem', ButtonTabItem)
Vue.component('Divider', Divider)
Vue.component('Search', Search)
Vue.component('XInput', XInput)
Vue.component('XTextarea', XTextarea)
Vue.component('XButton', XButton)
Vue.component('XHeader', XHeader)
Vue.component('XSwitch', XSwitch)
Vue.component('ActionSheet', Actionsheet)
Vue.component('icon', Icon)
Vue.component('Drawer', Drawer)

Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)

Vue.use(VueRouter)

const router = createRouter()

router.beforeEach((to, from,next) => {
    console.log(to)
    next()
})

new Vue({
    router: router,
    render: h => h(app)
}).$mount('#root')