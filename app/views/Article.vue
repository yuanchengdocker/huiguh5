<template>
    <div class="vue-chat-iframe">
        <iframe frameborder="0" style="height:100%;width:100%" src="/build/pages/science/list.html"></iframe>
    </div>
</template>

<script>
    import util from '../utils'
    export default {
        name: 'hgarticle',
        beforeRouteEnter: (to, from, next) => {
            util.updateChatUserName('科普文章')
            next()
        }
    }
</script>
