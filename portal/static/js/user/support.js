// $( window ).load(function() {
//     $("body").fadeIn(500);
// });
function showtextbox(id)
{
var tb = document.getElementById(id);
if(tb.style.display!=="none")
    tb.style.display="none";
else
    tb.style.display="block";
}
// $( window ).load(function() {
//             $("body").fadeIn(500);
// });
$(".page-navigation li a").click(function(e){  
    if (e.currentTarget.id == 'myPortfolios') {
        var ul = $(this).parent('li').children('ul');
            if(ul.is(':visible')) {
                setTimeout(function(){ 
                    ul.slideUp('fast');                
                }, 100);
            } else {
                setTimeout(function(){ 
                    ul.slideDown('fast');                
                }, 100);

            }
    }else {
        $(".statusbar").show()
        setTimeout(function(){ 
            var url = e.currentTarget.id
                console.log(url)
                if (url) {
                $("body").fadeOut(500, redirectPage(url));      
            }
        }, 1000);
    };
    function redirectPage(url) {
        location.assign(url)
        // window.location = url;
    }
})