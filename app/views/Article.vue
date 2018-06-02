<template>
    <div style="background-color: #f3f3f3;width: 100%;height: 100%;word-wrap: break-word;word-break: normal;white-space: normal;">
        <iframe frameborder="0" style="height:100%;width:100%" src="/build/pages/science/list.html"></iframe>
    </div>
</template>

<script>
    import util from '../utils'
    export default {
        name: 'article',
        beforeRouteEnter: (to, from, next) => {
            util.updateChatUserName('科普文章')
            next()
        }
    }
</script>
