$(document).ready(function() {
    scrollFresh(
        $(".list-container"),
        "conference_list",
        huiguPostUrl.conferenceList,10)
    pullUp($(".conference-list-box"));
})