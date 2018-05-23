<template>
    <div style="background-color: #f3f3f3;width: 100%;height: 100%;">
        <iframe ref="iframe" frameborder="0" scrolling="no" style="height:100%;width:100%" src="/build/pages/index.html"></iframe>
    </div>
</template>

<script>
    import util from '../utils'
    export default {
        name: 'self',
        beforeRouteEnter: (to, from, next) => {
            util.updateChatUserName('慧骨患者端')
            next()
        }
    }
</script>
