import React from 'react'  //必须使用
import loadable from 'react-loadable'

const page1 = loadable({
    loader: () => import('../components/page1/index'),
    loading() {
        return <div>Loading...</div>
    }
})

const page2 = loadable({
    loader: () => import('../components/page2/index'),
    loading() {
        return <div>Loading...</div>
    }
})

export default {
    page1,
    page2
}