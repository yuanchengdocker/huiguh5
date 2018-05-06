
export default [
    {
        path: '/',
        redirect: '/build/vuepage/page1'
    },
    {
        path: '/build/vuepage/page1',
        component: () => import('../views/Session.vue'),
        meta: { keepAlive: true }
    },
    {
        path: '/build/vuepage/session',
        component: () => import('../views/Session.vue'),
        meta: { keepAlive: true }
    },
    {
        path: '/build/vuepage/page2',
        component: () => import('../views/Session.vue'),
        meta: { keepAlive: false }
    }
]