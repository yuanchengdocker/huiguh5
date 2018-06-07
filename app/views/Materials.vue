<template>
    <div class="vue-chat-iframe">
        <iframe frameborder="0" style="height:100%;width:100%" :src="materialsUrl"></iframe>
    </div>
</template>

<script>
    import util from '../utils'
    export default {
        name: 'materials',
        beforeRouteEnter: (to, from, next) => {
            util.updateChatUserName('患教资料')
            next()
        },
        data(){
            let patientEducationId = this.$route.params.patientEducationId
            return {
                patientEducationId:patientEducationId,
                materialsUrl: `/build/pages/chat/detail.html?patientEducationId=${patientEducationId}`
            }
        },
        updated(){
        },
        methods:{
        }
    }
</script>
