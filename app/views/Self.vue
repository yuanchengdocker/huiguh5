<template>
    <div class="vue-chat-iframe">
        <iframe ref="iframe" frameborder="0" scrolling="no" style="height:100%;width:100%" src="/build/pages/index.html"></iframe>
    </div>
</template>

<script>
    import util from '../utils'
    export default {
        name: 'self',
        beforeRouteEnter: (to, from, next) => {
            util.updateChatUserName('个人中心')
            next()
        }
    }
</script>
