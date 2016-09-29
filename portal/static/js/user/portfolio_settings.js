console.log($("div#visePicked"))
  $("div#vise").hover(function() {
    $("li#selectedOption")[0].innerHTML = "Vise's Portfolio Wizard allows for the highest level of customization and freedom <br>for creaing portfolios. This option is recommended if you have specific preferences for trading, <br>such specific company stocks, restricting your portfolio to certain industries, or basing portfolios off of <br>desired return and risk calculation.Given your individual preferences, Vise will think <br>of a portfolio based on your specs and information derived from algorithms which analyze market movers."
  })
  $("div#vise").click(function(){
    $("#picker").css('display','none')
    $("#visePicked").css('display','initial')
  })     
  $("div#guru").hover(function() {
    $("li#selectedOption")[0].innerHTML = " <li>Creating a portfolio based on our Financial Guru's advice offers more flexibility <br>than templated portfolios, but offers less options compared to Vise's Portfolio Wizard. <br>This is recommended for users with some experience investing, <br>but would like to become more familiar with different strategies and options for trading.<li>"
  })
  $("div#template").hover(function() {
    $("li#selectedOption")[0].innerHTML = "<li> This option is a smart choice for beginners with no specific preference for portfolio settings.<br> Templated portfolios provide a standard base foundation and introduction toward investing with Vise.<li>"
  })    

function loadDummyData() {
    setTimeout(function(){ document.forms["wizard"].submit(); }, 3000);
}
$("button").click(function(e) {
    var button = e.currentTarget.outerText
    if (button == 'Low') {
        e.currentTarget.parentNode.parentNode.children[2].children[0].children[1].value = '25'
    } else if (button == 'Medium') {
        e.currentTarget.parentNode.parentNode.children[2].children[0].children[1].value = '50'
    } else if (button == 'High') {
        e.currentTarget.parentNode.parentNode.children[2].children[0].children[1].value = '75'
    }
})






 
    function showfield(){
        var mydropdown = document.getElementById('StockFilters');
        var strselect = mydropdown.options[mydropdown.selectedIndex].text;
           if(strselect=="Select filter")
           {
              document.getElementById('all_filters').style.display="none";
           }
           else if (strselect=="Price")
           {
              document.getElementById('all_filters').style.display="block";
              document.getElementById('priceinfo').style.display="block";
              document.getElementById('valuationinfo').style.display="none";
              document.getElementById('dividendinfo').style.display="none";
              document.getElementById('FRinfo').style.display="none";
              document.getElementById('OMinfo').style.display="none";
              document.getElementById('SMinfo').style.display="none";
              document.getElementById('margininfo').style.display="none";
              document.getElementById('growthinfo').style.display="none";
              document.getElementById('stockfillername1').innerHTML=strselect;
           }
           else if (strselect=="Valuation")
           {
              document.getElementById('all_filters').style.display="block";
              document.getElementById('valuationinfo').style.display="block";
              document.getElementById('priceinfo').style.display="none";
              document.getElementById('dividendinfo').style.display="none";
              document.getElementById('FRinfo').style.display="none";
              document.getElementById('OMinfo').style.display="none";
              document.getElementById('SMinfo').style.display="none";
              document.getElementById('margininfo').style.display="none";
              document.getElementById('growthinfo').style.display="none";
              document.getElementById('stockfillername2').innerHTML=strselect;
           }
           else if (strselect=="Dividend")
           {
              document.getElementById('all_filters').style.display="block";
              document.getElementById('dividendinfo').style.display="block";
              document.getElementById('valuationinfo').style.display="none";
              document.getElementById('priceinfo').style.display="none";
              document.getElementById('FRinfo').style.display="none";
              document.getElementById('OMinfo').style.display="none";
              document.getElementById('SMinfo').style.display="none";
              document.getElementById('margininfo').style.display="none";
              document.getElementById('growthinfo').style.display="none";
              document.getElementById('stockfillername3').innerHTML=strselect; 
            }   
          else if (strselect=="Financial Ratios")
           {
              document.getElementById('all_filters').style.display="block";
              document.getElementById('FRinfo').style.display="block";
              document.getElementById('valuationinfo').style.display="none";
              document.getElementById('priceinfo').style.display="none";
              document.getElementById('dividendinfo').style.display="none";
              document.getElementById('OMinfo').style.display="none";
              document.getElementById('SMinfo').style.display="none";
              document.getElementById('margininfo').style.display="none";
              document.getElementById('growthinfo').style.display="none";
              document.getElementById('stockfillername4').innerHTML=strselect; 
            }  
           else if (strselect=="Operating Metrics")
           {
              document.getElementById('all_filters').style.display="block";
              document.getElementById('OMinfo').style.display="block";
              document.getElementById('valuationinfo').style.display="none";
              document.getElementById('priceinfo').style.display="none";
              document.getElementById('dividendinfo').style.display="none";
              document.getElementById('FRinfo').style.display="none";
              document.getElementById('SMinfo').style.display="none";
              document.getElementById('margininfo').style.display="none";
              document.getElementById('growthinfo').style.display="none";
              document.getElementById('stockfillername5').innerHTML=strselect; 
            }   
           else if (strselect=="Stock Metrics")
           {
              document.getElementById('all_filters').style.display="block";
              document.getElementById('SMinfo').style.display="block";
              document.getElementById('valuationinfo').style.display="none";
              document.getElementById('priceinfo').style.display="none";
              document.getElementById('dividendinfo').style.display="none";
              document.getElementById('FRinfo').style.display="none";
              document.getElementById('OMinfo').style.display="none";
              document.getElementById('margininfo').style.display="none";
              document.getElementById('growthinfo').style.display="none";
              document.getElementById('stockfillername6').innerHTML=strselect; 
            }   
           else if (strselect=="Margins")
           {
              document.getElementById('all_filters').style.display="block";
              document.getElementById('margininfo').style.display="block";
              document.getElementById('valuationinfo').style.display="none";
              document.getElementById('priceinfo').style.display="none";
              document.getElementById('dividendinfo').style.display="none";
              document.getElementById('FRinfo').style.display="none";
              document.getElementById('OMinfo').style.display="none";
              document.getElementById('SMinfo').style.display="none";
              document.getElementById('growthinfo').style.display="none";
              document.getElementById('stockfillername7').innerHTML=strselect; 
            } 
            else if (strselect=="Growth")
             {
              document.getElementById('all_filters').style.display="block";
              document.getElementById('growthinfo').style.display="block";
              document.getElementById('valuationinfo').style.display="none";
              document.getElementById('priceinfo').style.display="none";
              document.getElementById('dividendinfo').style.display="none";
              document.getElementById('FRinfo').style.display="none";
              document.getElementById('OMinfo').style.display="none";
              document.getElementById('SMinfo').style.display="none";
              document.getElementById('margininfo').style.display="none";
              document.getElementById('stockfillername8').innerHTML=strselect; 
            }      
    }
   function lowrisk(){
    /*
    document.getElementById("expRisk").innerHTML = 25;*/
     newwindow=window.open(url,'name','height=400,width=400');
    if (window.focus) {newwindow.focus()}
    return false;
    }

  // $( function() {
  //   $( "#datepicker" ).calendarsPicker();
  // } );
   
