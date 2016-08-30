// $("body").css('display','none');
// $( window ).load(function() {
//     $("body").fadeIn(500);
// });
var company_name = $("#companyName")[0].innerText;
var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
url += '?' + $.param({
  'api-key': "1cf6ae6247764c28824a8f160cf73c75",
  'q': company_name,
});
$.ajax({
  url: url,
  method: 'GET',
}).done(function(result) {
  var news = result.response.docs
  if (news.length > 1) {
    news.forEach(function(x) {
      var clone = $("#cloner").clone().removeAttr('id');
      var ohtml = "<div class='list-text'>"+x.snippet+"</div>"
      clone[0].children[0].outerHTML = ohtml
      clone.attr('href',x.web_url)
      clone.appendTo($("#newsPin")).css('display','')
    })
  } else {
      var clone = $("#cloner").clone().removeAttr('id');
      var ohtml = "<div class='list-text'>No News Articles Found</div>"
      clone[0].children[0].outerHTML = ohtml
      clone.appendTo($("#newsPin")).css('display','')
  }
}).fail(function(err) {
  throw err;
});
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
    }
    if (e.currentTarget.id !== 'myPortfolios') {
        $(".statusbar").show()
        setTimeout(function(){ 
            var url = e.currentTarget.id
                console.log(url)
                if (url) {
                $("body").fadeOut(500, redirectPage(url))
                };      
        }, 1000);
    };
})
function redirectPage(url) {
    location.assign(url)
}