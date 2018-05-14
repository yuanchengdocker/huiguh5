
export default [
    {
        path: '/',
        redirect: '/build/vuepage/page1'
    },
    {
        path: '/build/vuepage/page1',
        component: () => import('../views/page2.vue'),
        meta: { keepAlive: true }
    },
    {
        path: '/build/vuepage/session',
        component: () => import('../views/Session.vue'),
        meta: { keepAlive: true }
    },
    {
        path: '/build/vuepage/chat/:sessionId',
        props: true,
        component: () => import('../views/Chat.vue'),
        meta: { keepAlive: false }
    }
]