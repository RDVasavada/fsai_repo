/*
 Copyright (c) 2016, BrightPoint Consulting, Inc.

 This source code is covered under the following license: http://vizuly.io/license/

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// @version 1.0.35

//**************************************************************************************************************
//
//  This is a test/example file that shows you one way you could use a vizuly object.
//  We have tried to make these examples easy enough to follow, while still using some more advanced
//  techniques.  Vizuly does not rely on any libraries other than D3.  These examples do use jQuery and
//  materialize.css to simplify the examples and provide a decent UI framework.
//
//**************************************************************************************************************


var viz;            // vizuly ui object
var viz_container;  // html element that holds the viz (d3 selection)
var viz_title;      // title element (d3 selection)
var theme;          // Theme variable to be used by our viz.

// Variables that will be used to update the y scale and radius scale by the test container settings panel.
// value == 1 - linear scale
// value < 1 == log scale
var rScale = 0.5, yScale = 0.3;

// D3 formatters we will use for labels
var formatMonthYear = d3.time.format("%-m/%y");
var formatDate = d3.time.format("%b %d, 20%y");
var formatCurrency = function (d) {
    return "$" + d3.format("0,000")(d)
};

// This example uses two data sources.  One is static and one is live
// Each data source has different payload structures.  We abstract the required properties for us to visualize into
// 'staticData' and 'liveData' objects which we store in the 'sources' object.  This allows us to easily toggle between them.
var dataSource;

// Test data
var staticData = {
    name: "can_nam",
    date: "exp_dat",
    dateParser: d3.time.format("%m/%d/%Y").parse,
    amount: "exp_amo",
    com_nam: "spe_nam",
    pty: "can_par_aff",
    url: "data/scatter_expenditure.csv"
};

// Live data from sunlight.org (you can use the static one if you want - the public one uses our API key.)
var liveData = {
    name: "candidate_name",
    date: "expenditure_date_formatted",
    dateParser: d3.time.format("%Y-%m-%d").parse,
    amount: "expenditure_amount",
    com_nam: "committee_name",
    pty: "candidate_party_checked",
    url: "http://realtime.influenceexplorer.com/api//independent-expenditures/?format=csv&page=1&page_size=10&support_oppose_checked=S&min_spent=10000&apikey=0e138d67832545b5bde92c1443637b52"
};
//  url:"data/scatter_sunlight_static.csv"};

// The sources object that stores both data source objects.
var sources = {static: staticData, live: liveData};

// Use jQuery to see when document is loaded
function loadData() {

    // Start by loading our live data
    d3.csv(sources.live.url, function (err, csv) {
        if (err) {
            console.log("Could not load live data from sunlight.org")
        }

        // Get rid of any data older than 3/2015
        sources.live.data = csv.filter(function (d) {
            d[sources.live.date] = sources.live.dateParser(d[sources.live.date]);
            return (Number(d[sources.live.date].getFullYear()) > 2014);
        });

        // We create keys for each candidate that we can later use to highlight
        // all candidate plots for a given candidate.
        sources.live.data.forEach(function (d) {

            // Use regex to clean strings as needed for our keys
            var can = String(d[sources.live.name]).replace(",", "_");
            can = can.replace(/[\s+,'+,\.,\(,\),\"]/g, "");
            can = can.toUpperCase();
            d.key = can;
        });

        // Update our settings panel to let us know when the live data is ready
        var opt = d3.selectAll("#dataSourceDiv li:last-child");
        opt.attr("class", null);
        opt.selectAll("span").text("Live - Sunlight.org");
        d3.selectAll("#liveDataOption").html("<a>Live - Sunlight.org</a>").attr("disabled", null);

    });


    //Here we grab our static data, meanwhile our live data is loading above;
    d3.csv(sources.static.url, function (csv) {

        sources.static.data = csv;

        // We create keys for each candidate that we can later use to highlight
        // all candidate plots for a given candidate.
        sources.static.data.forEach(function (d) {

            // Use regex to clean strings as needed for our keys
            var can = String(d[sources.static.name]).replace(",", "_");
            can = can.replace(/[\s+,'+,\.,\(,\),\"]/g, "");
            can = can.toUpperCase();
            d[sources.static.date] = sources.static.dateParser(d[sources.static.date]);
            d.key = can;
        });

        // Set our initial data source to this static data
        dataSource = sources.static;
        initialize();
    });
}


// Vizuly follows an almost identical function chaining syntax as that of D3.  If you know D3, vizuly will feel familiar to you,
// and if you are new to D3, programming vizuly will be a good introduction.
//
// In this routine we create our viz, set various properties, create a title and
// update the display.
//
function initialize() {

    //Here we set our <code>viz</code> variable by instantiating the <code>vizuly.component.corona</code> function.
    //All vizuly components require a parent DOM element at initialization so they know where to inject their display elements.
    viz = vizuly.component.scatter(document.getElementById("viz_container"));

    //Using the function chain syntax we can now set various properties of the bar chart.
    //
    //Both the <code>x</code> and <code>y</code> properties are used to map the data values
    //to the corresponding x and y axis within the chart.
    viz.data(dataSource.data)
        .width(screenWidth).height(screenHeight)              // initial component display size
        .y(function (d, i) {
            return Number(d[dataSource.amount]);     // property for y axis plot
        })
        .x(function (d, i) {
            return d[dataSource.date];              // property for x axis plot
        })
        .r(function (d, i) {
            return Number(d[dataSource.amount]);    // property for node radius plot
        })
        .duration(1500)                             // The length of time(ms) for any viz transitions to run
        .on("validate", onValidate)                 // Callback for the validate event
        .on("update", onUpdate)                     // Callback for update event
        .on("measure", onMeasure)                   // Callback for measure event
        .on("mouseout", onMouseOut);                // Callback for mouseout event

    //** Themes and skins **  play a big role in vizuly, and are designed to make it easy to make subtle or drastic changes
    //to the look and feel of any component.   Here we choose a theme and skin to use for our bar chart.
    // *See this <a href=''>guide</a> for understanding the details of themes and skins.*
    theme = vizuly.theme.scatter(viz)
        .skin(vizuly.skin.SCATTER_OCEAN)
        // Instead of attaching to the viz's mouseover event we are attaching to the theme's mouse over.
        // This allows us to make style changes that don't clobber the ones the theme is making, but goes after them.
        .on("mouseover", onMouseOver);

    //The <code>viz.selection()</code> property refers to the parent
    //container that was used at the object construction.  With this <code>selection</code> property we can use D3
    //add, remove, or manipulate elements within the component.  In this case we add a title label and heading to our chart.
    viz_title = viz.selection()
        .select("svg")
        .append("text")
        .attr("class", "title")
        .attr("x", viz.width() / 2)
        .attr("y", 40).attr("text-anchor", "middle")
        .style("fill", "#FFF")
        .style("font-family", "Raleway")
        .style("font-weight", 300);

    // Update the yAxis ticks function to show currency.
    viz.yAxis().tickFormat(function (d) {
        return formatCurrency(d / 1000000) + "M";
    });

    //The <code>viz.update()</code> function tells the component to render itself to the display.
    // Any property changes that have occurred since the last update (including changes to the data) will now be rendered.
    viz.update();

    /*
    // This code is for the purposes of the demo and simply cycles through the various skins
    // The user can stop this by clicking anywhere on the page.
    var reel = vizuly.showreel(theme, ['Sunset', 'Neon', 'Ocean'], 2000).start();
    d3.select("body").on("mousedown.reel", function () {
        //Stop show reel
        reel.stop();
        //Remove event listener
        d3.select("body").on("mousedown.reel", null);
    })
    */

}

// Set appropriate axis labels after viz validates and automatically creates any public properties.
function onValidate() {
    // Override automatically set linear scales to better fit this data using a pow scale.
    // This is an example of how you can modify viz properties during the object life-cycle.
    viz.rScale(d3.scale.pow().exponent(rScale));
    viz.yScale(d3.scale.pow().exponent(yScale));

}

// Just a simple function to make sure our title is centered if the <code>viz</code> measurements have changed.
function onMeasure() {
    viz.yScale().domain([0, viz.yScale().domain()[1]]);  //Want a zero based axis
    viz_title.attr("x", viz.width() / 2);
    viz.xAxis().tickFormat(formatMonthYear);
    viz.yAxis().ticks(9);
    viz.xAxis().ticks(14);
    viz_title.style("font-size", Math.min(viz.width(), viz.height()) / 35);
}

// We are going to add some meta data to our graph so we can filter out elements.
// For each plot we are going to add a dummy class based on the candidate id associated with the data for that plot.
// This will allow us to later select ALL plots related to a specific candidate on mouseover
function onUpdate() {
    viz.selection().selectAll(".vz-scatter-node").each(function (d) {
        d3.select(this).attr("class", function (d) {
            return "vz-scatter-node " + d.key;
        });
    })

    // Each time we update we want to see the TOTAL contributions for the data set so we can display it in the title.
    // Here we loop through the data to get that total.
    var total = 0;
    dataSource.data.forEach(function (d) {
        total += Number(d[dataSource.amount]);
    })

    // Update the title text.
    viz_title.transition().text("Total: " + formatCurrency(Math.round(total)));
}

// On mouse over we select all plots related to the candidate ID and highlight them.
function onMouseOver(e, d, i) {
    viz.selection().selectAll(".vz-scatter-node." + d.key).style("fill", "#FFF").style("fill-opacity", .8).style("opacity", 1);
    // We create our data tip
    createDataTip(e, d);
}

// All we need to do here is remove the data tip when the user moves the mouse away and restore all elements.
function onMouseOut(e, d, i) {
    restoreElements();
    removeDataTip();
}

// Just re-applies the theme to clear all style changes we made.
function restoreElements() {
    theme.apply();
}

// Removes the data tipe.
function removeDataTip(name) {
    d3.selectAll(".vz-scatter-label").remove();
}

// Here is a template for our data tip
var datatip = '<div class="tooltip" style="width: 220px; background-opacity:.5">' +
    '<div class="header1">HEADER1</div>' +
    '<div class="header-rule"></div>' +
    '<div class="header2"> HEADER2 </div>' +
    '<div class="header-rule"></div>' +
    '<div class="header3" style="font-size:12px;"> HEADER3 </div>' +
    '<div class="header3"> HEADER4 </div>' +
    '</div>';


// This function uses the above html template to replace values and then creates a new <div> that it appends to the
// document.body.  This is just one way you could implement a data tip.
function createDataTip(e, d, total) {

    var h1 = formatDate(d[dataSource.date]);
    var h2 = d[dataSource.name];
    var h3 = d[dataSource.com_nam];
    var h4 = formatCurrency(d[dataSource.amount]);
    var rect = viz.selection().selectAll(".vz-scatter-plot")[0][0].getBoundingClientRect();

    var x = Number(d3.select(e).attr("cx")) + rect.left;
    var y = Number(d3.select(e).attr("cy")) + rect.top;

    var html = datatip.replace("HEADER1", h1);
    html = html.replace("HEADER2", h2);
    html = html.replace("HEADER3", h3);
    html = html.replace("HEADER4", h4);

    d3.select("body")
        .append("div")
        .attr("class", "vz-scatter-label")
        .style("position", "absolute")
        .style("top", (y - 155) + "px")
        .style("left", (x - 110) + "px")
        .style("opacity", 0)
        .html(html)
        .transition().style("opacity", 1);

}

//
// Functions used by the test container to set various properties of the viz
//
function changeSkin(val) {
    if (!val) return;
    theme.skin(val);
    viz.selection().selectAll(".vz-bar").attr("height", 0).attr("y", viz.height());
    viz_title.style("fill", theme.skin().labelColor);
    viz.update();
}


function changeSize(val) {
    var s = String(val).split(",");
    viz.selection().selectAll(".vz-bar").attr("width", 0).attr("x", 0);
    viz_container.transition().duration(300).style('width', s[0] + 'px').style('height', s[1] + 'px');
    viz.width(s[0]).height(s[1]).update();

}

function changeRScale(val) {
    rScale = 1 / Number(val);
    viz.update();
}

function changeYScale(val) {
    yScale = 1 / Number(val);
    viz.update();
}

function changeData(val) {
    dataSource = sources[val];
    viz.data(dataSource.data).update();
}

