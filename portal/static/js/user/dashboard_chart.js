$("div.svg-container").detach()
var d3;
var margin = {top: 0, right: 25, bottom: 50, left: 50},
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
   .classed("svg-container", true)
   
    //container class to make it responsive
   .append("svg")
   //responsive SVG needs these 2 attributes and no width and height attr
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 650 300")
   //class to make it responsive
   .classed("svg-content-responsive", true)
    .style("margin-top", "-25") 
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
    "where%20symbol%20%3D%20%22^GSPC%22%20and%20startDate%20%3D%20%22"
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