var margin = {top: 25, right: 25, bottom: 50, left: 50},
    width = 600 - margin.left - margin.right,
    height = 265 - margin.top - margin.bottom;
var parseDate = d3.time.format("%Y-%m-%d").parse;
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);
var    yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);
var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.high); });
var svg = d3.select(".ibox-content")
    // .append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
   .append("div")
   .classed("svg-container", true) //container class to make it responsive
   .append("svg")
   //responsive SVG needs these 2 attributes and no width and height attr
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 650 300")
   //class to make it responsive
   .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform", "translate(" 
        + margin.left 
        + "," + margin.top + ")");
var stock = document.getElementById('stock').value;
var start = document.getElementById('start').value;
var end = document.getElementById('end').value;

var inputURL = "http://query.yahooapis.com/v1/public/yql"+
    "?q=select%20*%20from%20yahoo.finance.historicaldata%20"+
    "where%20symbol%20%3D%20%22"
    +stock+"%22%20and%20startDate%20%3D%20%22"
    +start+"%22%20and%20endDate%20%3D%20%22"
    +end+"%22&format=json&env=store%3A%2F%2F"
    +"datatables.org%2Falltableswithkeys";

    // Get the data 
    d3.json(inputURL, function(error, data){

    data.query.results.quote.forEach(function(d) {
        d.date = parseDate(d.Date);
        d.high = +d.High;
        d.low = +d.Low;
    });

    // Scale the range of the data
    x.domain(d3.extent(data.query.results.quote, function(d) {
        return d.date; }));
    y.domain([
        d3.min(data.query.results.quote, function(d) { return d.low; }), 
        d3.max(data.query.results.quote, function(d) { return d.high; })
    ]);

    svg.append("path")        // Add the valueline path.
        .attr("class", "line")
        .attr("d", valueline(data.query.results.quote));

    svg.append("g")            // Add the X Axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .style("fill", "#fff")
        .call(xAxis);

    svg.append("g")            // Add the Y Axis
        .attr("class", "y axis")
        .style("fill", "#fff")
        .call(yAxis);

    svg.append("text")          // Add the label
        .attr("class", "label")
        .attr("transform", "translate(" + (width+3) + "," 
            + y(data.query.results.quote[0].high) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "steelblue")
        .text("high");
});

// ** Update data section (Called from the onclick)
function changeTime(s) {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    month = String(month)
    if (month.length == 1) {month = "0"+ month}
    var endDate = year + "-" + month + "-" + day;
    console.log(month)
    document.getElementById('end').value = endDate;
    if (s === '1y') {
        year -=1
    } else if (s == '90d') {
        month -=3
        month = String(month)
        if (month.length == 1) {month = "0"+ month}
    } else if (s == '30d') {
        month -=1
        month = String(month)
        if (month.length == 1) {month = "0"+ month}
    }
    var startDate = year + "-" + month + "-" + day;
    document.getElementById('start').value = startDate;
    var market = document.getElementById('chosenMarket').innerText
    console.log(market)
    if (market == 'Nasdaq Composite') {updateData('^IXIC')}
    if (market == 'Dow Jones Industrial Average') {updateData('^DJI')}
    if (market == 'S&P 500') {updateData('^GSPC')}
}
function updateData(stock) {
if (stock == '^IXIC') {document.getElementById('chosenMarket').innerText = "Nasdaq Composite"}
if (stock == '^DJI') {document.getElementById('chosenMarket').innerText = "Dow Jones Industrial Average"}
if (stock == '^GSPC') {document.getElementById('chosenMarket').innerText = "S&P 500"}
var stock = stock;
var start = document.getElementById('start').value;
var end = document.getElementById('end').value;
console.log(start)
console.log(end)
console.log(stock)

var inputURL = "http://query.yahooapis.com/v1/public/yql"+
    "?q=select%20*%20from%20yahoo.finance.historicaldata%20"+
    "where%20symbol%20%3D%20%22"
    +stock+"%22%20and%20startDate%20%3D%20%22"
    +start+"%22%20and%20endDate%20%3D%20%22"
    +end+"%22&format=json&env=store%3A%2F%2F"
    +"datatables.org%2Falltableswithkeys";

    // Get the data again
    d3.json(inputURL, function(error, data){
        console.log(data.query)
        data.query.results.quote.forEach(function(d) {
            d.date = parseDate(d.Date);
            d.high = +d.High;
            d.low = +d.Low;
        });

        // Scale the range of the data
        x.domain(d3.extent(data.query.results.quote, function(d) {
            return d.date; }));
        y.domain([
            d3.min(data.query.results.quote, function(d) { 
                return d.low; }), 
            d3.max(data.query.results.quote, function(d) { 
                return d.high; })
        ]);

        // Select the section we want to apply our changes to
        var svg = d3.select("body").transition();

        // Make the changes
        svg.select(".line")    // change the line
            .duration(750) 
            .attr("d", valueline(data.query.results.quote));

        svg.select(".label")   // change the label text
            .duration(750)
            .attr("transform", "translate(" + (width+3) + "," 
            + y(data.query.results.quote[0].high) + ")");
 
        svg.select(".shadow") // change the title shadow
            .duration(750)
            .text(stock);  
             
        svg.select(".stock")   // change the title
            .duration(750)
            .text(stock);
     
        svg.select(".x.axis") // change the x axis
            .duration(750)
            .call(xAxis);
        svg.select(".y.axis") // change the y axis
            .duration(750)
            .call(yAxis);

    });
}


// });
// $("body").css('display','none');
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function(){
        if (xhr.readyState==4 && xhr.status==200)
        {
            var news  = JSON.parse(xhr.responseText).items
            news.forEach(function(x) {
                var clone = $("#incomingNews").clone()
                // clone[0].children[0].children[0].href = x.link
                clone[0].children[0].children[0].innerText = x.title
                clone.removeAttr('id').css('display','initial').appendTo($("#newsPin"))
            })
        };
    }
xhr.open('GET','http://rss2json.com/api.json?rss_url=http://finance.yahoo.com/rss/headline?s=yhoo,msft,tivo,appl,googl,tsla',true);
xhr.send();


if (!localStorage['historical']) {
    var stocks = $(".historical")[0].innerText
    stocks = stocks.replace(/\s/g, '');
    localStorage.setItem('historical',stocks)
} else {
    var gains = 0
    var data = JSON.parse(localStorage['historical'])
    data.forEach(function(x,i) {
        for (key in x) {
            for (ley in x[key]){
                makeGraph(x[key][ley].data, x[key][ley])
                var buy_price = x[key][ley].data[0]
                var price = (x[key][ley].current_price)
                var gain = (Number(price) - buy_price) * x[key][ley].number_of_shares

                if (gain) {
                    gains+=gain
                    localStorage.setItem('gains',gains)
                    $("span#gains")[0].innerText = gains.toFixed(2)
                }
            }
        }
    })
}
function makeGraph(hist, ticker){
    
}
var initval = $("div#initVal")
for (d in initval) {
    if (parseInt(d) || d == 0){
        var a = initval[d].parentNode.children[1].innerText
        var b = initval[d].parentNode.children[2].innerText
        var c = (parseFloat(a)/parseFloat(b)*100).toFixed(2)
        initval[d].parentNode.children[6].innerText = c + "%"
    }
}
var risks = $("div#riskVal")
var totalRisk = 0
for (e in risks) {
    total = 1
    if (parseInt(e) || e == 0){
        var r = risks[e].innerText
        totalRisk+=Number(r)
        total += 1
        totalRisk = totalRisk / total
        $("input#risks")[0].value =totalRisk.toFixed(0)
    }
}
// initval.forEach(function(x) {
//     console.log(typeof(x))
// })
// console.log(parseInt(currval)/parseInt(initval))




