/*
 Copyright (c) 2016, BrightPoint Consulting, Inc.

 This source code is covered under the following license: http://vizuly.io/commercial-license/

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// @version 1.0.35

//
// This is the base component for a vizuly scatter
//
vizuly.component.scatter = function (parent) {

    // This is the object that provides pseudo "protected" properties that the vizuly.viz function helps create
    var scope={};

    var properties = {
        "data" : null,                           //Expects array of single series of data;
        "margin": {                             // Our margin object
            "top": "10%",                       // Top margin
            "bottom": "7%",                     // Bottom margin
            "left": "9%",                       // Left margin
            "right": "7%"                       // Right margin
        },
        "duration": 500,                        // This the time in ms used for any component generated transitions
        "width": 300,                           // Overall width of component
        "height": 300,                          // Height of component
        "x":null,                               // Function that returns xScale data value
        "y":null,                               // Function that returns yScale data value
        "r":null,                               // Function that returns rScale data value
        "xScale" : "undefined",                 // Default xScale (can be overridden after 'validate' event via callback)
        "yScale" : "undefined",                 // Default yScale (can be overridden after 'validate' event via callback)
        "rScale" : "undefined",                 // Default rScale - radius (can be overridden after 'validate' event via callback)
        "xAxis" : d3.svg.axis(),                // Default xAxis (can be overridden after 'validate' event via callback)
        "yAxis" : d3.svg.axis()                 // Default xAxis (can be overridden after 'validate' event via callback)
    };

    //Create our viz and type it
    var viz=vizuly.viz.create(parent,scope,properties);
    viz.type="viz.chart.column";


    //Measurements
    var size;           // Holds the 'size' variable as defined in viz.util.size()
    var plotMaxRadius;  // Holds the maximium radius for all plots

    //These are all d3.selection objects we use to insert and update svg elements into
    var svg,g,bottomAxis,leftAxis, plot, plots, background, plotBackground, defs;

    initialize();

    // Here we set up all of our svg layout elements using a 'vz-XX' class namespace.  This routine is only called once
    // These are all place holder groups for the individual data driven display elements.   We use these to do general
    // sizing and margin layout.  The all are referenced as D3 selections.
    function initialize() {

        svg = scope.selection.append("svg").attr("id", scope.id).style("overflow","visible").attr("class","vizuly");
        background = svg.append("rect").attr("class","vz-background")
        defs = vizuly.util.getDefs(viz);
        g = svg.append("g").attr("class","vz-scatter-viz");
        bottomAxis = g.append("g").attr("class","vz-scatter-bottom-axis").attr("clip-path","url(#" + scope.id + "_xClipPath)").append("g");
        leftAxis = g.append("g").attr("class","vz-scatter-left-axis");
        plot = g.append("g").attr("class","vz-scatter-plot").attr("clip-path","url(#" + scope.id + "_plotClipPath)");
        plotBackground = plot.append("rect").attr("class","vz-plot-background").style("fill","transparent").style("fill-opacity",0);

        // Tell everyone we are done initializing
        scope.dispatch.initialize();
    }

    // The measure function performs any measurement or layout calcuations prior to making any updates to the SVG elements
    function measure() {

        // Call our validate routine and make sure all component properties have been set
        viz.validate();

        // Get our size based on height, width, and margin
        size = vizuly.util.size(scope.margin, scope.width, scope.height);

        // If our scales have not been defined yet, then we will default them based on the data values.
        if (scope.xScale == "undefined") {
            scope.xScale=vizuly.util.getTypedScale(viz.x()(scope.data[0]));
        }

        if (scope.yScale == "undefined") {
            scope.yScale=vizuly.util.getTypedScale(viz.y()(scope.data[0]));
        }

        if (scope.rScale == "undefined") {
            scope.rScale=vizuly.util.getTypedScale(viz.r()(scope.data[0]));
        }

        // Set the domain values for the scale
        setScaleDomain(scope.xScale,scope.x,scope.data);
        setScaleDomain(scope.yScale,scope.y,scope.data);
        setScaleDomain(scope.rScale,scope.r,scope.data);

        // Determine the plot max radius based on the size of the viz
        plotMaxRadius = Math.min(size.width,size.height)/20;

        // Set the ranges of our scales based on the viz size and max plot radius
        vizuly.util.setRange(scope.yScale,size.height-plotMaxRadius,plotMaxRadius);
        vizuly.util.setRange(scope.xScale,plotMaxRadius,size.width-plotMaxRadius);
        vizuly.util.setRange(scope.rScale,1,plotMaxRadius);

        // Default our x and y axis
        scope.xAxis.scale(scope.xScale).orient("bottom");
        scope.yAxis.scale(scope.yScale);

        // Tell everyone we are done making our measurements
        scope.dispatch.measure();

    }

    // The update function is the primary function that is called when we want to render the visualiation based on
    // all of its set properties.  A developer can change properties of the components and it will not show on the screen
    // until the update function is called
    function update() {

        // Call measure each time before we update to make sure all our our layout properties are set correctly
        measure();

        // Layout all of our primary SVG d3 elements.
        svg.attr("width", scope.width).attr("height", scope.height);
        background.attr("width", scope.width).attr("height", scope.height);
        plot.style("width",size.width).style("height",size.height).attr("transform","translate(" + (size.left + plotMaxRadius) + "," + size.top +  ")");
        bottomAxis.attr("transform","translate(" + (size.left) + "," + (size.height + size.top) + ")");
        leftAxis.attr("transform","translate(" + size.left + "," + size.top + ")");
        plotBackground.attr("width",size.width).attr("height",size.height);

        // Create our plots using the select, enter, exit pattern
        plots = plot.selectAll(".vz-scatter-node").data(scope.data);

        // Set plots to initially be at the bottom of the plot in the correct x position with a 0 radius
        plots.enter().append("circle")
            .attr("class","vz-scatter-node")
            .attr("r",0)
            .attr("cx",function(d,i) { return scope.xScale(scope.x(d))})
            .attr("cy",function(d,i) { return size.height;})
            .on("mouseover",function (d,i) { scope.dispatch.mouseover(this,d,i) })
            .on("mouseout",function (d,i) { scope.dispatch.mouseout(this,d,i) })
            .on("click",function (d,i) { scope.dispatch.click(this,d,i) })
            .style("fill-opacity",.3);

        // Remove any plots that are no longer in the data set
        plots.exit().remove();

        // Animate the plots to the correct cx, cy and radius
        plots.transition().duration(scope.duration)
            .attr("cx",function(d,i) { return scope.xScale(scope.x(d))})
            .attr("cy",function(d,i) { return scope.yScale(scope.y(d))})
            .attr("r",function(d,i) { return scope.rScale(scope.r(d))})
            .style("fill",function(d,i) {
                var green = ((scope.xScale(scope.x(d))/500)*255);
                var red = 255 - green;
                var color = "rgb(" + Math.round(red) + "," + Math.round(green)+",0)"
                 return  color});
            // .attr("cx",function(d,i) { return scope.xScale(scope.x(d))})

        // Update our axis labels
        bottomAxis.call(scope.xAxis);
        leftAxis.call(scope.yAxis);

        // Let everyone know we are doing doing our update
        // Typically themes will attach a callback to this event so they can apply styles to the elements
        scope.dispatch.update();

    }

    // A utility function that sets the scale's domains based on data type
    function setScaleDomain(scale,value,data) {
        if (typeof value(data[0]) == "string") {
            scale.domain(data.map(function (d) { return value(d); }));
        }
        else {
            scale.domain([d3.min(data, function (d) { return value(d); }), d3.max(data, function (d) { return value(d); })]);
        }
    }

    // This is our public update call that all viz components implement
    viz.update = function () {
        update();
        return viz;
    };

    // Returns our glorious viz component :)
    return viz;

};