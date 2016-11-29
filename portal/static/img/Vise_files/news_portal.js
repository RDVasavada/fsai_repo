var chosen_stock = "";
$(".scroll-pail").height('80vh').mCustomScrollbar()
$.ajax({
    url:"news_portal/getnews/",
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
                var newitem =  "<div class='block block-transparent' style='box-shadow:0px;background:rgba(0,0,0,0.2);font-family:Raleway;padding:15px;letter-spacing:2px;font-size:14px'><a href='"+pub_url+"' target='_blank'>"+w.snippet+"<hr>"+w.pub_date+"</a></div>"
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
        if (Number(x.sentiment) < 50) {
            sentiment_value = String(x.sentiment).slice(0,String(x.sentiment).indexOf("."))
            $("#sentiment").append("<span style='font-size:20px;margin-right:15vw;font-family:Raleway'>"+x.ticker+"<span style='color:rgba(255,0,0,1);font-family:Raleway'>↓"+sentiment_value+"</span></span>")           
        } else{
            sentiment_value = String(x.sentiment).slice(0,String(x.sentiment).indexOf("."))
            $("#sentiment").append("<span style='font-size:20px;margin-right:15vw;font-family:Raleway'>"+x.ticker+"<span style='color:rgba(0,255,0,1);font-family:Raleway'>↑"+sentiment_value+"</span></span>")
        }
    }) 
})
 var visualize = function() {
    console.log("<iframe style='width:99%;height:80vh' src='/user/scatter/"+chosen_stock+"'></iframe>")
    $("#visual_modal").append("<iframe style='width:100%;height:60vh' src='/user/scatter/"+chosen_stock+"/'></iframe>")
    $("#modal_wide_1").fadeIn(250)
}

$(".marquee").toggleClass("microsoft");
$("#sentiment").fadeIn(250)
var varwidth = $("div#choose").width()*.66
console.log(varwidth)
// var xwidth = $("#sentiment_box").css("width")
// console.log(String(xwidth) + " is xwidth")
var d3;
var margin = {top: 0, right: 25, bottom: 50, left: 50},
    width = Number(varwidth)*1.15 - margin.left - margin.right,
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
   .attr("viewBox", "0 0 450 350")
   //class to make it responsive
   .classed("svg-content-responsive", true)
    .style("max-height", "265") 
    .style("min-height", "265") 
    .append("g")
    .attr("transform", "translate(" 
        + margin.left 
        + "," + margin.top + ")");

    // Get the data 
    d3.json("news_portal/stock_sentiment_graph/BRCD/", function(error, data){
    data.query.results.quote.forEach(function(d) {
        d.date = parseDate(d.date);
        d.high = Number(d.High)*100;
        d.low = Number(d.High)*100;
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

function updateData(stock) {
    var inputURL = "news_portal/stock_sentiment_graph/" + String(stock) + "/"
    var parseDate = d3.time.format("%Y-%m-%d").parse;
    d3.json(inputURL, function(error, data){
        data.query.results.quote.forEach(function(d) {
            d.date = parseDate(d.date);
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




