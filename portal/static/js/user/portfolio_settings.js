
$("a").click(function() {
  var portname = $("#portname")[0].value
  console.log(portname)
  $("#xname")[0].innerText = portname
})

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
    setTimeout(function(){ document.forms["wizard"].submit(); }, 2000);
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



function pe() {
    console.log("asdf")
}

 
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
   function expreturn(str){
      if (str == 'low') {
        $("#expReturn")[0].value = 25
        $("#returnR")[0].value = 25
         $("#returnR").trigger('change');
      } else if (str == 'med') {
        $("#expReturn")[0].value = 50
        $("#returnR")[0].value = 50
         $("#returnR").trigger('change');
      } else if (str == 'high') {
        $("#expReturn")[0].value = 75
        $("#returnR")[0].value = 75
         $("#returnR").trigger('change');
      }
    }
  function riskreturn(str){
      if (str == 'low') {
        $("#expRisk")[0].value = 25
        $("#riskR")[0].value = 25
         $("#riskR").trigger('change');
      } else if (str == 'med') {
        $("#expRisk")[0].value = 50
        $("#riskR")[0].value = 50
         $("#riskR").trigger('change');
      } else if (str == 'high') {
        $("#expRisk")[0].value = 75
        $("#riskR")[0].value = 75
         $("#riskR").trigger('change');
      }
    }
    function choseMarket(str, e) {
      if (str == 'NDX') {
        $("#djimkt").css('border','0px solid #2f4050')
        $("#spmkt").css('border','0px solid #2f4050')
        $("#ndxmkt").css('border','1px solid #2f4050')
        $("#Market")[0].value = "Nasdaq"
      } else if (str == "SP") {
        $("#djimkt").css('border','0px solid #2f4050')
        $("#spmkt").css('border','1px solid #2f4050')
        $("#ndxmkt").css('border','0px solid #2f4050')        
        $("#Market")[0].value = "S&P500"
      }else if (str == "DJI") {
        $("#djimkt").css('border','1px solid #2f4050')
        $("#spmkt").css('border','0px solid #2f4050')
        $("#ndxmkt").css('border','0px solid #2f4050')        
        $("#Market")[0].value = "Dow Jones"
      }
    }

    var mouseisdown = false;
    $("#theslider").mousedown(function(event) {
        mouseisdown = true;
      change()
    }).mouseup(function(event) {
      change()
    });

    function change() {
        var percent = String($("#theslider").css('left')).slice(0,-2)
        if (percent < 600) {
          $("#investing_amount")[0].value = (1000 * (percent/400)).toFixed(2)
        } else {
          $("#investing_amount")[0].value = (3000 * (percent/100)).toFixed(2)
        }
    }

    



  // $( function() {
  //   $( "#datepicker" ).calendarsPicker();
  // } );
   
