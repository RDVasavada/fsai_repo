var colors = ["white","#87CEEB","rgb(79, 155, 43)","color: rgb(255, 152, 6)"," color: rgb(166, 45, 45);"]
let goStock = function(e) {
    $(".statusbar")[0].innerText = "Loading " + e.innerText + "'s Stock Information ..."
    $(".statusbar").show()
    if ($("#company_name")[0].value){
      document.forms["myForm"].submit();
    } else {
      document.forms["myForm"].submit();
    }
    $("#company_name").value = e.innerText;
}