import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import defaultState from './state/state'
import actions from './actions/actions'
import getters from './getters/getters'
import mutations from './mutations/mutations'


const isDev = process.env.NODE_ENV === 'development'


const store = new Vuex.Store({
    // strict: isDev, // 为true时会警告外部直接对$store上面的state进行操作， 只在开发环境可以设置
    state: defaultState,
    mutations,
    getters,
    actions
})

if (module.hot) {
    module.hot.accept([
        './state/state',
        './mutations/mutations',
        './getters/getters',
        './actions/actions'
    ], () => {
        const newState = require('./state/state').default
        const newMutations = require('./mutations/mutations').default
        const newGetters = require('./getters/getters').default
        const newActions = require('./actions/actions').default

        store.hotUpdate({
        state: newState,
        mutations: newMutations,
        getters: newGetters,
        actions: newActions
        })
    })
}

export default store