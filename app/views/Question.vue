<template>
    <div class="vue-chat-iframe">
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
            next()
        },
        data(){
            let followupQuestionnaireId = this.$route.params.followupQuestionnaireId
            let ofPatientId = this.$route.params.ofPatientId
            return {
                followupQuestionnaireId:followupQuestionnaireId,
                ofPatientId:ofPatientId,
                questionUrl: this.buildUrl(followupQuestionnaireId,ofPatientId)
            }
        },
        mounted(){
        },
        updated(){
        },
        created(){
            var that = this
            window.questionSubmitCallback = function(questionnaireId,shareTitle,followupRecordingId){
                if(questionnaireId){
                    that.buildAndPutMsg({callback:(msg)=>{
                        that.$store.dispatch('updateIsQuestionSubmit',true)
                        that.$store.dispatch('updateChatMsgStatus',1)
                        if(msg){
                            that.sendMsg(msg)
                        }
                        that.$router.push(`/build/vuepage/chat/${that.sessionId}`);
                    },content: {
                    mediaContent: {
                        followupRecordingId:followupRecordingId,
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
            this.setCurrSession(this.sessionId)
        },
        methods:{
            ...mapActions(['buildAndPutMsg','sendMsg','setCurrSession']),
            buildUrl(followupQuestionnaireId,ofPatientId){
                return `/build/pages/chat/share.html?followupQuestionnaireId=${followupQuestionnaireId}&ofPatientId=${ofPatientId}`
            }
        },
        computed:{
            sessionId(){
                return this.$route.params.sessionId
            }
        }
    }
</script>
