$("div#main").removeClass()
var colors = ["white","#87CEEB","rgb(79, 155, 43)","color: rgb(255, 152, 6)"," color: rgb(166, 45, 45);"]
var goStock = function(e) {
    $(".statusbar")[0].innerText = "Loading " + e.innerText + "'s Stock Information ..."
    $(".statusbar").show()
    $("#company_name")[0].value = e.innerText;
    // console.log($("#company_name"))
    if ($("#company_name")[0].value){
      document.forms["myForm"].submit();
    } else {
      document.forms["myForm"].submit();
    }
}
var length = $("h2#d_sentiment").length
for (var i = 0; i <= Number(length); i++) {
    var stars = Number(String($("h2#d_sentiment")[i].innerText).slice(0,1))
    if (stars <= 2) {
        $("h2#d_sentiment")[i].innerHTML = "<i class='icon-star'></i><i class='icon-star-empty'></i><i class='icon-star-empty'></i><i class='icon-star-empty'></i><i class='icon-star-empty'></i>"
    } else if (stars > 2 && stars <= 4) {
        $("h2#d_sentiment")[i].innerHTML = "<i class='icon-star'></i><i class='icon-star'></i><i class='icon-star-empty'></i><i class='icon-star-empty'></i><i class='icon-star-empty'></i>"
    } else if (stars > 4 && stars <= 6) {
        $("h2#d_sentiment")[i].innerHTML = "<i class='icon-star'></i><i class='icon-star'></i><i class='icon-star'></i><i class='icon-star-empty'></i><i class='icon-star-empty'></i>"
    } else if (stars > 6 && stars <= 8) {
        $("h2#d_sentiment")[i].innerHTML = "<i class='icon-star'></i><i class='icon-star'></i><i class='icon-star'></i><i class='icon-star'></i><i class='icon-star-empty'></i>"
    } else if (stars > 8 && stars <= 10) {
        $("h2#d_sentiment")[i].innerHTML = "<i class='icon-star'></i><i class='icon-star'></i><i class='icon-star'></i><i class='icon-star'></i><i class='icon-star'></i>"
    }

}

var downloadCsv = function() {
  var table = $("#optimizedPortfolio").children()
  csvarr = [['Ticker_Symbol','Number_of_shares','Buy_date','Sell_date','Expected_Return','Expected_Risk']]
  for (var key in table) {
    if (typeof(table[key]) == 'object' && String(table[key]) == '[object HTMLTableRowElement]') {
      rowArr = (table[key].outerText).split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
      csvarr.push(rowArr)
    }
  }
  var csvContent = "data:text/csv;charset=utf-8,";
  csvarr.forEach(function(infoArray, index){

   dataString = infoArray.join(",");
   csvContent += index < csvarr.length ? dataString+ "\n" : dataString;

  }); 
  var encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
  console.log(csvarr)
}
