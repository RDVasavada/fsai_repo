var DIVY = "DIVYIELD;;"
var MKTCAP = "MARKETCAP;;"
var PE = "PE;;"
var PB = "PB;;"
var EPUSD = "EPUSD;;"
var NETMARGIN = "NETMARGIN;;"
var filters = [0,0,0,0,0,0,]
var get_guru = function(id) {
  $("#chosenGuru")[0].value = id
  $("#pickPin").empty()
  $.ajax({
    url: '/user/guru_portfolio/'+id,
    type: 'POST',
    data: {'data':'adata'}
  }).done(function(portfolio) {
      portfolio.data.forEach(function(stock,i) {
        console.log(stock)
        var rtnstr = ("<tr><td>"+(i+1)+"</td><td><a href='/user/individual_stock/"+stock.symbol+"/\'>" + stock.symbol + "</a></td><td>"+stock.company+"</td><td>"+stock.value+"</td><td>"+stock.change+"</td><td>"+stock.exchange+"</td><td>"+stock['13f_date']+"</td><td>"+stock.impact+"</td><td>"+stock.share+"</td><td>"+stock.yield+"</td><td>"+stock.industry+"</td><td>"+stock.sector+"</td><td>"+stock.position+"</td><td>"+stock.pct+"</td><td>"+stock.mktcap+"</td></tr>")
        console.log(rtnstr)
        $("#pickPin").append(rtnstr)
      })
  })
}

 var showHide = function(){
   var div = document.getElementById('loadingImg');
   if (div.style.display == 'none') {
     div.style.display = '';
     document.getElementById('picker').style.display = 'none'
   }
   else {
     div.style.display = 'none';
     document.getElementById('picker').style.display = 'none'
   }
 }


/* Set the width of the side navigation to 0 */
var closeNav = function() {
    document.getElementById("mySidenav").style.width = "0";
}



var openNav = function(id, chosenGuruName) {
  $("#pickPin").empty()
  $("#chosenGuruName")[0].innerText = chosenGuruName + "'s Portfolio"
  localStorage.setItem('togglePortfolio',JSON.stringify({'open':1}))
  $.ajax({
    url: '/user/guru_portfolio/'+id,
    type: 'POST',
    data: {'data':'adata'}
  }).done(function(data) {
    // console.log(data)
      data.data.forEach(function(stock,i) {
        var rtnstr = ("<tr><td>"+(i+1)+"</td><td><a href='/user/individual_stock/"+stock.symbol+"/\'>" + stock.symbol + "</a></td><td>"+stock.company+"</td><td>"+stock.value+"</td><td>"+stock.change+"</td><td>"+stock.exchange+"</td><td>"+stock['13f_date']+"</td><td>"+stock.impact+"</td><td>"+stock.share+"</td><td>"+stock.yield+"</td><td>"+stock.industry+"</td><td>"+stock.sector+"</td><td>"+stock.position+"</td><td>"+stock.pct+"</td><td>"+stock.mktcap+"</td></tr>")
        console.log(rtnstr)
        $("#pickPin").append(rtnstr)
      })
  })
    document.getElementById("mySidenav").style.width = "100vw";
    $("#portNav").fadeIn(250)
}

var filterPortfolios = function() {
  $("#muteLink").fadeOut(250);
  setTimeout(function(){
    $("#activeLink").fadeIn(250);
  }, 250);

  filters.forEach(function(x,i) {
    if (x == 1) {
      var operator = ""
      var eval = 0
      if (i == 0) {
        if ($("#odivy").val() == 1) {
          operator = "<"
        }
        if ($("#odivy").val() == 2) {
          operator = "<="
        }
        if ($("#odivy").val() == 3) {
          operator = ">="
        }
        if ($("#odivy").val() == 4) {
          operator = ">"
        }
        var cVal = $("#vdivy")[0].value
        if (cVal) {
          eval = cVal
        } else {
          eval = 1000
        }
        DIVY = "DIVYIELD;" + operator + ";" + eval
      }

      if (i == 1) {
        if ($("#omktcap").val() == 1) {
          operator = "<"
        }
        if ($("#omktcap").val() == 2) {
          operator = "<="
        }
        if ($("#omktcap").val() == 3) {
          operator = ">="
        }
        if ($("#omktcap").val() == 4) {
          operator = ">"
        }
        var cVal = $("#vmktcap")[0].value
        if (cVal) {
          eval = cVal
        } else {
          eval = 1000
        }
        MKTCAP = "MARKETCAP;" + operator + ";" + eval
      }

      if (i == 2) {
        if ($("#onm").val() == 1) {
          operator = "<"
        }
        if ($("#onm").val() == 2) {
          operator = "<="
        }
        if ($("#onm").val() == 3) {
          operator = ">="
        }
        if ($("#onm").val() == 4) {
          operator = ">"
        }
        var cVal = $("#vnm")[0].value
        if (cVal) {
          eval = cVal
        } else {
          eval = 1000
        }
        NETMARGIN = "NETMARGIN;" + operator + ";" + eval
      }

      if (i == 3) {
        if ($("#ope").val() == 1) {
          operator = "<"
        }
        if ($("#ope").val() == 2) {
          operator = "<="
        }
        if ($("#ope").val() == 3) {
          operator = ">="
        }
        if ($("#ope").val() == 4) {
          operator = ">"
        }
        var cVal = $("#vpe")[0].value
        if (cVal) {
          eval = cVal
        } else {
          eval = 1000
        }
        PE = "PE;" + operator + ";" + eval
      }

      if (i == 4) {
        if ($("#opb").val() == 1) {
          operator = "<"
        }
        if ($("#opb").val() == 2) {
          operator = "<="
        }
        if ($("#opb").val() == 3) {
          operator = ">="
        }
        if ($("#opb").val() == 4) {
          operator = ">"
        }
        var cVal = $("#vpb")[0].value
        if (cVal) {
          eval = cVal
        } else {
          eval = 1000
        }
        PB = "PB;" + operator + ";" + eval
      }

      if (i == 5) {
        if ($("#oepusd").val() == 1) {
          operator = "<"
        }
        if ($("#oepusd").val() == 2) {
          operator = "<="
        }
        if ($("#oepusd").val() == 3) {
          operator = ">="
        }
        if ($("#oepusd").val() == 4) {
          operator = ">"
        }
        var cVal = $("#vepusd")[0].value
        if (cVal) {
          eval = cVal
        } else {
          eval = 1000
        }
        EPUSD = "EPUSD;" + operator + ";" + eval
      }
    }
  })
  var criteria = [DIVY,MKTCAP,NM,PE,PB,EPUSD]
  $("#xdivy")[0].value = DIVY
  $("#xmktcap")[0].value = MKTCAP
  $("#xnm")[0].value = NM
  $("#xpe")[0].value = PE
  $("#xpb")[0].value = PB
  $("#xepusd")[0].value = EPUSD
  // $("#finalcriteria").submit()
  $.ajax({
    method: "POST",
    url: "/user/guru_optimize/",
    data: {"xdivy":DIVY,
            "xmktcap":MKTCAP,
            "xnm":NM,
            "xpe":PE,
            "xpb":PB,
            "xepusd":EPUSD}
  }).done(function(x) {
    console.log(x)
    payload = x.post
    lastdate = ""
    dateArr = payload.Snapshot_date
    dateRealArr = payload.Snapshot_date
    stockArr = payload.stocks
    priceArr = payload.price
    no_of_shares = payload.no_of_shares
    lastdate = ""
    dateArr.forEach(function(date, index) {
      if (index == 0) {
        lastdate = date.slice(0,4)
      }
      var indexDate = Number(String(date).slice(0,4))
      var oldDate = Number(String(lastdate).slice(0,4))
      if (indexDate > oldDate) {
        lastdate = indexDate
      }
    })
    newDateArr = []
    newStockArr = []
    newPriceArr = []
    newShares = []
    dateArr.forEach(function(date,index) {
      newdate = Number(String(date).slice(0,4))
      if (newdate == lastdate) {
        newDateArr.push(newdate)
        newStockArr.push(stockArr[index])
        newPriceArr.push(priceArr[index])
        newShares.push(no_of_shares[index])
      }
    })
    newStockArr.forEach(function(x, index) {
      $("#optimizePin").append("<tr><td>" + (index + 1) + "</td><td>" + x + "</td><td>$" + String(newPriceArr[index]).slice(0,2) + "." + String(newPriceArr[index]).slice(3,5) + "</td><td>" + newShares[index] + "</td></tr>")
    })
    $("#filterLoader").fadeOut(250)
    console.log(newDateArr)
    console.log(newStockArr)
    console.log(newPriceArr)
    console.log(newDateArr)
  })
}
 
$("#cdivy").click( function(){
   if( $(this).is(':checked') ) {
    $("#fdivy").fadeIn(250);
    filters[0] = 1
   } else {
    $("#fdivy").fadeOut(250);
    filters[0] = 0
   }
});
$("#cmktcap").click( function(){

   if( $(this).is(':checked') ) {
    $("#fmktcap").fadeIn(250);
    filters[1] = 1
   } else {
    $("#fmktcap").fadeOut(250);
    filters[1] = 0
   }
});
$("#cnm").click( function(){

   if( $(this).is(':checked') ) {
    $("#fnm").fadeIn(250);
    filters[2] = 1
   } else {
    $("#fnm").fadeOut(250);
    filters[2] = 0
   }
});
$("#cpe").click( function(){

   if( $(this).is(':checked') ) {
    $("#fpe").fadeIn(250);
    filters[3] = 1
   } else {
    $("#fpe").fadeOut(250);
    filters[3] = 0
   }
});
$("#cpb").click( function(){

   if( $(this).is(':checked') ) {
    $("#fpb").fadeIn(250);
    filters[4] = 1
   } else {
    $("#fpb").fadeOut(250);
    filters[4] = 0
   }
});
$("#cepusd").click( function(){

   if( $(this).is(':checked') ) {
    filters[5] = 1
    $("#fepusd").fadeIn(250);
   } else {
    filters[5] = 0
    $("#fepusd").fadeOut(250);
   }
});