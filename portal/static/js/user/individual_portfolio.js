
let goStock = function(e) {
    $(".statusbar")[0].innerText = "Loading " + e.innerText + "'s Stock Information ..."
    $(".statusbar").show()
    if ($("#company_name")[0].value){
      $("#company_name")[0].value = "WBA";
      document.forms["myForm"].submit();
    } else {
      $("#company_name")[0].value = "WBA";
      console.log($("#company_name"))
      document.forms["myForm"].submit();
    }
    // $("#company_name").value = e.innerText;
    // $("#company_name")[0].value = "";
}
