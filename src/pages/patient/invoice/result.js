 $(document).ready(function() {
    
     huiguPost(function(data){
        if(data.code == 0){
            $(".invoice").html(_.template($("#invoice_result").html()) (data.data))
        }
    },huiguPostUrl.conferenceOrder,{"invoiceId":$.getUrlParam('invoiceId')})
})