var chosen_stock = "";
$(".scroll-pail").height('60vh').mCustomScrollbar()
$.ajax({
    url:"/user/news_portal/getnews/",
    method: "POST"
}).done(function(data){
    data.news.forEach(function(newsItem) {
        console.log(newsItem)
        newsItem.response.docs.forEach(function(w) {
            var pub_date = w.pub_date
            var pub_url = w.web_url
            var snippet = w.snippet
            console.log()
            if (String(snippet) !== "null") {
                var newitem =  "<div class='task-item priority-high' style='margin-top:15px'><div class='task-item-content'><div class='task-item-subhead' style='padding-top:15px;height:150px;font-size:12px'><a href='"+pub_url+"' target=_blank>"+w.snippet+"</a></div><div class='task-item-date'><i class='icon-calendar'></i>"+w.pub_date+"<i class='icon-time'></i></div></div></div>"
                $("#news_pinner").append(newitem)
            }
        })
    $("#feeder").css('display','none')
    })
})
$.ajax({
    url:"/user/dashboard/your_sentiment/",
    method: "POST"
}).done(function(data){
    data.sentiment.forEach(function(x) {
        if (x.sentiment > 50) {
            $("#sentiment").append("<span style='font-size:20px;margin-right:15vw'>"+x.ticker+"<span style='color:rgba(0,255,0,1)'>↑"+x.sentiment+"</span></span>")
        } else {
            $("#sentiment").append("<span style='font-size:20px;margin-right:15vw'>"+x.ticker+"<span style='color:rgba(255,0,0,1)'>↓"+x.sentiment+"</span></span>")

        }
    }) 
})
var visualize = function() {
    console.log("<iframe style='width:99%;height:80vh' src='/user/scatter/"+chosen_stock+"'></iframe>")
    $("#visual_modal").append("<iframe style='width:99%;height:60vh' src='/user/scatter/"+chosen_stock+"/'></iframe>")
    $("#modal_wide_1").fadeIn(250)

}
$(".marquee").toggleClass("microsoft");
$("#sentient").fadeIn(250)
var d3;
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
    .style("max-height", "265") 
    .style("min-height", "265") 
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
    console.log(startDate)
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




