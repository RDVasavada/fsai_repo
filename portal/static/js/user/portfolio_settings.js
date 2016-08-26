$("body").css('display','none');
function loadDummyData() {
    setTimeout(function(){ document.forms["myForm"].submit(); }, 2000);
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




    var rangeSlider = document.getElementById('basic_slider');
    
    noUiSlider.create(rangeSlider, {
        start: [30],
        range: {
            'min': [ 0 ],
            'max': [ 100 ]
        }
    });
    var rangeSliderValueElement = document.getElementById('basic_slider_value');
    var riskSliderRiskElement = document.getElementById('risk_slider_risk');
    rangeSlider.noUiSlider.on('update', function( values, handle ) {
        rangeSliderValueElement.innerHTML = values[handle] + "%";
        if(values[handle] < 30) {
            riskSliderRiskElement.innerHTML = "<p style='color:green;'>Low Risk</p>"
        } else if(values[handle] > 30 && values[handle] < 60) {
            riskSliderRiskElement.innerHTML = "<p style='color:orange;'>Medium Risk</p>"
        } else if (values[handle] > 60) {
            riskSliderRiskElement.innerHTML = "<p style='color:red;'>High Risk</p>"
        }
    });
    function stockChecker() {
        var stocksNumberElement = document.getElementById('stocks_number');
        if (stocksNumberElement.value > 30) { stocksNumberElement.value = 30} else if (stocksNumberElement.value < 3) { stocksNumberElement.value = 3}
    }
    function returnChecker() {
        var expReturnElement = document.getElementById('expReturn');
        if (expReturnElement.value > 50) { expReturnElement.value = 50} else if (expReturnElement.value < 1) { expReturnElement.value = 1}
    }
    function riskChecker() {
        var expRiskElement = document.getElementById('expRisk');
        if (expRiskElement.value > 20) { expRiskElement.value = 20} else if (expRiskElement.value < 1) { expRiskElement.value = 1}
    }
    function popitup(url) {
        newwindow=window.open(url,'name','height=400,width=400');
        if (window.focus) {newwindow.focus()}
        return false;
    }
    function showfield(){
        var mydropdown = document.getElementById('StockFilters');
        var strselect = mydropdown.options[mydropdown.selectedIndex].text;
        if(strselect=="Select filter")
            document.getElementById('stockinfo').style.display="none";
        else
            document.getElementById('stockinfo').style.display="block";
            document.getElementById('stockfillername').innerHTML=strselect;
       
    }
   function lowrisk(){
    /*
    document.getElementById("expRisk").innerHTML = 25;*/
     newwindow=window.open(url,'name','height=400,width=400');
    if (window.focus) {newwindow.focus()}
    return false;
    }

  $( function() {
    $( "#datepicker" ).calendarsPicker();
  } );
   