
export default [
    {
        path: '/',
        redirect: '/build/vuepage/self'
    },
    {
        path: '/build/vuepage/self',
        component: () => import('../views/Self.vue'),
        meta: { keepAlive: true }
    },
    {
        path: '/build/vuepage/article',
        component: () => import('../views/Article.vue'),
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