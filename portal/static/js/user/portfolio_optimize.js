$( window ).load(function() {
    $("body").fadeIn(1000);
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
                location.assign(url)
            }
        }, 1000);
    };
})

var months = $("#months")[0].innerText
var market = parseInt($("#market")[0].innerText);
var investingAmount = $("#investingAmount")[0].innerText;
var numStocks = $("#numStocks")[0].innerText;
var expectedRisk = $("#expectedRisk")[0].innerText;
var expectedReturn = $("#expectedReturn")[0].innerText;
var utc = new Date().toJSON().slice(0,10);
var xMonths = parseInt(utc[5] + utc[6]) + parseInt(months);
var shares = [];

if (xMonths > 12) {
        xYear = (parseInt(utc[0]+utc[1]+utc[2]+utc[3]))+1;
        utc = utc[0]+utc[1]+utc[2]+utc[3]+"-"+xMonths+utc[7]+utc[8];
    } else {
        xYear = parseInt(utc[0]+utc[1]+utc[2]+utc[3]);
        utc = xYear + "-" + xMonths + "-" + utc[8]+utc[9]
    };

var markets = ["S&P 500","NASDAQ","Dow Jones","US Markets"];
var market = markets[market-1];
var companyNames = ["NSA","TSLA","AIL","ABC","UTY"];
generateRandomShares();
function generateRandomShares() {
    for (var i=0;i<numStocks;i++) {
      shares.push(1);
    };
    shares.forEach(function(x,i) {
      if (i === shares.length-1 ) {
        console.log("last one");
        console.log(shares)
        generateData(shares)
      } else {
        var y = (Math.floor(Math.random() * (shares.length) + 1));
        if (y !== 1) {
          shares[i]=y;
          for (var f=1;f<=y;f++) {
            if (i === shares.length-1 ) {
                console.log("last one")
                console.log(shares)
                generateData(shares)
            }
            shares.pop();
          };
        }
      };
    });
    generateData(shares)    
};
function generateData(arr){
    arr.forEach(function(x,i) {
            var clone = $("#incoming").clone()
            clone[0].innerHTML = "";
            var xName = $("#companyName").clone().removeAttr('id');
            var xCompanyName = $("  #months").clone().removeAttr('id');
            var ran = Math.floor((Math.random() * 13) + 0);
            var ranCom = ['ABM','APPL','AWR','T','VVC','CB','CL','CVX','GOOG','KO','AMAZN','FUL','GIS'];
            var ranName = ['ABM Industries','APPLE','AWR Corporation','AT&T','Vectren Corp','Chubb Ltd','Colgate-PalmOlive Company','Chevron','Google','Coca-Cola Co','Amazon Inc','HB Fuller Co','General Mills']
            xName[0].children[2].href+=String(ranCom[ran])
            xName[0].children[0].innerText = String(ranCom[ran]);
            xName.appendTo(clone);
            xCompanyName[0].innerText = String(ranName[ran]);
            xCompanyName.appendTo(clone);
            var xNumStocks = $("#numStocks").clone().removeAttr('id');
            xNumStocks[0].innerText = x;
            xNumStocks.appendTo(clone);
            var xMonths = $("#months").clone().removeAttr('id');
            xMonths[0].innerText = new Date().toJSON().slice(0,10);
            xMonths.appendTo(clone);
            var sellDate = $("#months").clone().removeAttr('id');
            sellDate[0].innerText = utc;
            sellDate.appendTo(clone);
            var xExpectedReturn = $("#expectedReturn").clone().removeAttr('id');
            xExpectedReturn[0].innerText = expectedReturn +"%";
            xExpectedReturn.appendTo(clone);
            var xExpectedRisk = $("#expectedRisk").clone().removeAttr('id');
            xExpectedRisk.appendTo(clone)
            clone.appendTo(pin);

    })

            $("#incoming").css('display','none')
}