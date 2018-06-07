export default [
    {
        path: '/',
        redirect: '/build/vuepage/menu/self'
    },
    {
        path: '/build/vuepage/menu',
        component: () => import('../views/Menu.vue'),
        meta: { keepAlive: true },
        children: [
            {
                path: '/build/vuepage/menu/self',
                component: () => import('../views/Self.vue'),
                meta: { keepAlive: true }
            },
            {
                path: '/build/vuepage/menu/article',
                component: () => import('../views/Article.vue'),
                meta: { keepAlive: true }
            },
            {
                path: '/build/vuepage/menu/session',
                component: () => import('../views/Session.vue'),
                meta: { keepAlive: true }
            }
        ]
    },
    {
        path: '/build/vuepage/materials/:patientEducationId',
        props: true,
        component: () => import('../views/Materials.vue'),
        meta: { keepAlive: false }
    },
    {
        path: '/build/vuepage/question/:sessionId/:followupQuestionnaireId/:ofPatientId',
        props: true,
        component: () => import('../views/Question.vue'),
        meta: { keepAlive: false }
    },
    {
        path: '/build/vuepage/chat/:sessionId',
        props: true,
        component: () => import('../views/Chat.vue'),
        meta: { keepAlive: false }
    }
]