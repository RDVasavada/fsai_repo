$("input").keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
      msg = $("#messageBody")[0].value
        if ($("#selected")[0].value) {
            to = $("#selected")[0].value
        } else {
            to = "0"
        }
        $.ajax({
            method: "POST",
            url: "/user/sendmsg",
            data: {'message': msg, 'to' : to } ,
        }).done(function() {
            console.log("done")
        })
        $("#messageBody")[0].value = ""
    }
});
          
$(".mail-scroll").height('75vh').mCustomScrollbar()
$(".mail-scroll").mCustomScrollbar("update");
setTimeout(function(){
    $(".mail-scroll").mCustomScrollbar("scrollTo","bottom",{scrollInertia:0});
},1000);

$("i#emptystar").click(function() {
    if ($(this).attr('class') == 'icon-star-empty pull-right') {
        $(this).attr('class','icon-star pull-right')    
    } else {
        $(this).attr('class','icon-star-empty pull-right')    
    }
})
var addfriend = function() {
    var username = $("#query")[0].value
    console.log(username)
    $.ajax({
        type: 'POST',
        url: '/user/addconnection',
        data: {'query':username}
    }).done(function(result){
        if (result.data == 0){
            $(".stepone").css('display','none')
            $("#statusbar_8").css('height','150px')
            $(".stepone")[0].innerText = "We could not find a user by that name or email. Try Again!"
            $(".stepone").css('display','initial')
        } else{
            $("#addfriend").css('display','none')
            $("#statusbar_8").css('height','150px')
            $(".stepone")[0].outerHTML = "<img src='/static/img/loader.gif' style='display:block;margin:auto;padding-top:20px'></div>"
            setTimeout(function(){ 
                window.location = "/user/inbox";
            }, 200);
            
        }
    })
}
$("#submitBtn").click(function(x) {
    msg = $("#messageBody")[0].value
    if ($("#selected")[0].value) {
        to = $("#selected")[0].value
    } else {
        to = "-"
    }
    $.ajax({
        method: "POST",
        url: "/user/sendmsg",
        data: {'message': msg, 'to' : to } ,
    }).done(function() {
        $(".mail-scroll").mCustomScrollbar("update");
        $(".mail-scroll").mCustomScrollbar("scrollTo","bottom",{scrollInertia:0});
        console.log("done")
    })
    $("#messageBody")[0].value = ""
    // console.log($("#messageBody")[0].value)
})
