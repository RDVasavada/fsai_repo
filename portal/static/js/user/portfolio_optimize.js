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