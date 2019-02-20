/* Retrieve the node of the div element declared within the index.html by its identifier */

var visContainerNode = d3.select("#vis-container");

// Specify margins such that the visualization is clearly visible and no elements are invisible due to the svg border
var margins = {
    top: 20,
    right: 25,
    bottom: 20,
    left: 50
};

// Specify the width and height of the svg as well as the width height of the viewport of the visualization.
var width = 1200;
var height = 800;
var gapY = 50;
var focusAreaHeight = 600 - margins.top;
var contextAreaHeight = 200 - margins.bottom - gapY;
var visWidth = width - margins.left - margins.right;
var visHeight = focusAreaHeight + contextAreaHeight;

/* Appending an svg element to the vis-container, set its width and height (in pixels), and add it to the vis-container */
var svg = visContainerNode.append("svg").attr("width", width).attr("height", height);
svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", visWidth)
    .attr("height", visHeight);

// Adding a group element to the svg to realize the margin by translating the group.
var viewport = svg.append("g").attr("transform", "translate(" + margins.left + "," + margins.top + ")");

var dateParser = d3.timeParse('%m %Y');
var dateFormat = d3.timeFormat('%m / %Y');
var curve = d3.curveMonotoneX;

// We use the d3.dsv method, which uses the fetchAPI internally, to retrieve the data
d3.dsv(";", "pr_1991_2015.csv", function (d) {
    return {
        date: dateParser(d.Month + " " + d.Year),
        rain: parseFloat(d.pr),
        temperature: parseFloat(d.tas)
    };
}).then(function (data) {
    console.log("Raw Data:", data);

    // Init Scales
    var xFocus = d3.scaleTime().domain(d3.extent(data, function (d) {
        return d.date;
    })).range([0, visWidth]);
    var yRainFocus = d3.scaleLinear().domain([0, d3.max(data.map(function (d) {
        return d.rain
    }))]).range([focusAreaHeight, 0]);
    var yTempFocus = d3.scaleLinear().domain(d3.extent(data.map(function (d) {
        return d.temperature
    }))).range([focusAreaHeight, 0]);

    // In order to organize our code, we add one group for the focus visualization (the large lien chart)
    var focusVis = viewport.append("g");

    // Initialize a line generator for each line
    var rainLine = d3.line()
        .x(function (d) {
            return xFocus(d.date);
        })
        .y(function (d) {
            return yRainFocus(d.rain);
        })
        .curve(curve);

    var tempLine = d3.line()
        .x(function (d) {
            return xFocus(d.date);
        })
        .y(function (d) {
            return yTempFocus(d.temperature);
        })
        .curve(curve);

    // Append two path elements
    focusVis.append("path")
        .datum(data)
        .attr("class", "line line-rain")
        .attr("d", rainLine);
    focusVis.append("path")
        .datum(data)
        .attr("class", "line line-temp")
        .attr("d", tempLine);

    // Lets add some axis
    var axisG = focusVis.append("g");
    var xAxisFocus = d3.axisBottom(xFocus);
    axisG.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + focusAreaHeight + ")")
        .call(xAxisFocus);

    axisG.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yTempFocus));

    axisG.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + visWidth + ", 0)")
        .call(d3.axisRight(yRainFocus));

    // Append three text elements to the axisG group and label the axes respectively
    axisG.append("text").text("Temperature").attr("x", -50).attr("y", -5).attr("fill", "red");
    axisG.append("text").text("Rain").attr("x", visWidth - 10).attr("y", -5).attr("fill", "blue");
    axisG.append("text").text("Years").attr("x", visWidth / 2).attr("y", focusAreaHeight - 10);

    // Create the context visualization (small line chart) directly below the focus vis
    // Init scales since range differs
    var xContext = d3.scaleTime().domain(d3.extent(data, function (d) {
        return d.date;
    })).range([0, visWidth]);
    var yContextRain = d3.scaleLinear().domain([0, d3.max(data.map(function (d) {
        return d.rain
    }))]).range([contextAreaHeight, 0]);
    var yContexttemp = d3.scaleLinear().domain(d3.extent(data.map(function (d) {
        return d.temperature
    }))).range([contextAreaHeight, 0]);

    // To organize our code, we add one group for the context visualization
    var contextVis = viewport.append("g").attr("transform", "translate(0," + (focusAreaHeight + gapY) + ")");
    var xAxisContext = d3.axisBottom(xContext);
    contextVis.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + contextAreaHeight + ")")
        .call(xAxisContext);

    // Init two line generators
    var rainLineContext = d3.line()
        .x(function (d) {
            return xContext(d.date);
        })
        .y(function (d) {
            return yContextRain(d.rain);
        })
        .curve(curve);

    var tempLineContext = d3.line()
        .x(function (d) {
            return xContext(d.date);
        })
        .y(function (d) {
            return yContexttemp(d.temperature);
        })
        .curve(curve);

    // Add the two lines for rain and temperature
    contextVis.append("path")
        .datum(data)
        .attr("class", "line line-rain")
        .attr("d", rainLineContext);
    contextVis.append("path")
        .datum(data)
        .attr("class", "line line-temp")
        .attr("d", tempLineContext);


    /*
    * Add Interactive Features here
    */

    /*
     TASK: Add the brush using the d3.brush function, define the extent and the necessary event functions
     Append a new group element and apply the brush on it using the "call" function
     During the brush and on brush end you want to make sure that the lines are redrawn correctly by setting their "d" attribute
    */

    //


    var brush = d3.brushX()
        .extent([[-10, -10], [width+10, height+10]])
        .on("brush end", brushed);


    var zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);

    contextVis.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, xContext.range());



    function brushed() {
        if (d3.event || d3.event.selection)
        var s = d3.event.selection || xContext.range();

        xFocus.domain(s.map(xContext.invert, xContext));
        focusVis.select(".line-rain").attr("d", rainLine);
        focusVis.select(".line-temp").attr("d", tempLine);
        focusVis.select(".x axis").call(xAxisFocus);
        focusVis.select(".zoom").call(zoom.transform, d3.zoomIdentity
            .scale(visWidth / (s[1] - s[0]))
            .translate(-s[0], 0));
    }

    function zoomed() {
        if (d3.event || d3.event.selection)
        var t = d3.event.transform;
        xFocus.domain(t.rescaleX(xContext).domain());
        focusVis.select(".line-rain").attr("d", rainLine);
        focusVis.select(".line-temp").attr("d", tempLine);
        axisG.select(".x axis").call(xAxisFocus);
        contextVis.select(".brush").call(brush.move, xContext.range().map(t.invertX, t));
    }
})