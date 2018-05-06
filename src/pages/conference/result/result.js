 $(document).ready(function() {

     $(".conference-order").html(_.template($("#conference_order_detail").html()) ({
        "appointmentId":0,
        "appointmentCode":"",
        "conferenceId":"",
        "appointTime":0,
        "coverUrl":"",
        "conferenceName":"",
        "price":0,
        "appointCount":0,
        "totalPrice":0,
        "holdingProvince":"",
        "holdingCity":"",
        "holdingStartTime":0,
        "holdingEndTime":0,
        "holdingPlace":"",
        "appointUser":"",
        "appointPhone":"",
        "appointEmail":"" 
    }))
    huiguPost(function(data){
        $(".conference-order").html(_.template($("#conference_order_detail").html()) (data.data))
    },huiguPostUrl.conferenceOrder,{appointmentId:optUrlParams("conferenceId")})

    
})