<template>
    <div class="vue-chat-iframe vue-chat-iframe-full">
        <iframe frameborder="0" style="height:100%;width:100%" :src="questionUrl"></iframe>
    </div>
</template>

<script>
    import util from '../utils'
    import {
        mapActions,
        mapState,
        mapGetters
    } from 'vuex'
    export default {
        name: 'question',
        beforeRouteEnter: (to, from, next) => {
            util.updateChatUserName('随访问卷')
        },
        data(){
            let followupQuestionnaireId = this.$route.params.followupQuestionnaireId
            let ofPatientId = this.$route.params.ofPatientId
            return {
                questionUrl: `/build/pages/chat/share.html?followupQuestionnaireId=${followupQuestionnaireId}&ofPatientId=${ofPatientId}`
            }
        },
        created(){
            var that = this
            window.questionSubmitCallback = function(questionnaireId,shareTitle){
                if(questionnaireId){
                    that.buildAndPutMsg({callback:(msg)=>{
                        that.sendMsg(msg)

                        window.history.go(-1)
                    },content: {
                    mediaContent: {
                        questionnaireId:questionnaireId,
                        shareItemID:'',
                        shareTitle:shareTitle,
                        shareBrief:'问卷已填写，请查看'
                    },
                    messageContentType: 15,
                    textContent: ''
                    } })
                }
            }
        },
        mounted(){
            let sessionId = this.$route.params.sessionId
            this.setCurrSession(sessionId)
        },
        methods:{
            ...mapActions(['buildAndPutMsg','sendMsg','setCurrSession']),
        },
        computed:{
        }
    }
</script>
