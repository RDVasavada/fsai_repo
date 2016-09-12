// $("body").css('display','none');
function goStock(e) {
  $(".statusbar")[0].innerText = "Loading " + e.innerText + "'s Stock Information ..."
  $(".statusbar").show()
  $("#company_name")[0].value = e.innerText;
  document.forms["myForm"].submit();
}