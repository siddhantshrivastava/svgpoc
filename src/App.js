import "bootstrap/dist/css/bootstrap.css";
import * as d3 from "d3";
import React from "react";
import "./App.css";
import ecg from "./ecg.json";
class d3Chart extends React.Component {
    constructor(props) {
        super(props)
        this.state = { data: "" }
    }

    componentDidMount() {
        this.draw()
    }


    draw() {

        //selecting main svg container
        const graphContainer = d3.select(".main-container"),
            ecgData = ecg.Data.ECG;
            
        //main array containing all elements
        let groups = [];

        //creating an array containing plotting points for x-axis grid lines
        let xDomain = d3.max(ecgData, function (d, i) {
            return d3.max(d, (t, i) => {
                if (i === 0)
                    return t;
            });
        });

        let xgrid = [...Array(xDomain / 40 + 1).keys()].map((i) => i * 40);

        //creating an array containing plotting points for y-axis grid lines
        let yDomainMax = d3.max(ecgData, function (d, i) {
            return d3.max(d, (t, i) => {
                if (i > 0)
                    return t;
            });
        });

        let yDomainMin = d3.min(ecgData, function (d, i) {
            return d3.min(d, (t, i) => {
                if (i > 0)
                    return t;
            });
        });

        let ymax = yDomainMax > Math.abs(yDomainMin) ? Math.ceil(yDomainMax) : Math.ceil(Math.abs(yDomainMin));

        let ymin = -ymax;
        let ygrid = [];
        for (let i = ymin; i <= ymax; i = Number((i + 0.1).toFixed(1))) {
            ygrid.push(i)
        }

        //Dimension of graph
        const width = xDomain * 3.2 / 40,
            height = ymax * 2 * 3.2 * 10;

        const subContainer = graphContainer.append("g").attr("class", "row m-0 mb-3 pl-2 pr-2")

        for (let i = 0; i < 4; i++) {
            let viewStart = i < 1 ? 0 : i < 2 ? width / 4 : i < 3 ? width / 2 : width / 4 * 3;
            const g1 = subContainer.append("g").attr("class", "col-sm-3 p-2")
            for (let j = 0; j < 3; j++) {
                const gc = g1.append("svg").attr("viewBox", `${viewStart} ${height / 2.7} ${width / 4} ${width / 4 / 16 * 5}`).attr("width", 300).attr("height", 150).attr('class', `svg${i} col-sm-12 border p-0 mt-3`),
                    gs = gc.append("g");
                groups.push([gc, gs])
            }
        }

        const x = d3.scaleLinear()
            .domain([0, xDomain])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([-ymax, ymax])
            .range([height, 0]);

        const make_x_grid_lines = () => {
            return d3.axisBottom(x)
                .tickValues(xgrid)
        }

        const make_y_gridlines = () => {
            return d3.axisLeft(y)
                .tickValues(ygrid)
        }
        let yIndex;
        let count = 1;
        const lineCount = d3.line()
            .x(function (d) { return x(d[0]); })
            .y(function (d) { return y(d[count]); })

        const lineCount2 = d3.line()
            .x(function (d) { return x(d[0]); })
            .y(function (d) { return y(d[yIndex]); })
        // .curve(d3.curveBasis);


        // add the X gridlines
        groups.forEach((ele) => {
            ele[1].append("rect")
                .attr("width", width)
                .attr("height", height)
                .attr("fill", "white");
        })
        groups.forEach((ele) => {
            ele[1].append("g")
                .attr("class", `grid`)
                .attr("fill", "blue")
                .attr("transform", "translate(0," + height + ")")
                .call(make_x_grid_lines()
                    .tickSize(-height)
                    .tickFormat(""));
        })

        //add the Y gridlines
        groups.forEach((ele) => {
            ele[1].append("g")
                .attr("class", `grid`)
                .call(make_y_gridlines()
                    .tickSize(-width)
                    .tickFormat(""));
        })

        // Add the annotation on graph
        groups.forEach((ele) => {

            ele[1].append("text")
                .attr("x", 0.08 * 200)
                .attr("y", 5)
                .attr("font-size", "8")
                .text("I");

            ele[1].append("text")
                .attr("x", 0.08 * 200)
                .attr("font-size", "8")
                .text("(N");
        })

        // Add the x and y Axis
        // groups.forEach((ele) => {
        //     ele[1].append("g")
        //         .attr("transform", "translate(0," + height + ")")
        //         .call(d3.axisBottom(x));

        //     ele[1].append("g")
        //         .attr("class", "axis axis--y")
        //         .call(d3.axisLeft(y));
        // })


        //plot name of the lead on graph
        let leadNames = ["I", "II", "III", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"]
        groups.forEach((ele, i) => {
            ele[1].append("text")
                .attr("fill", "#000")
                .attr("transform", "translate(30,5)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .style("text-anchor", "end")
                .style("font-size", "12")
                .text(leadNames[i]);
        })
        let click_count = 0,
            click_ele = [],
            xSelect = [];


        groups.forEach((ele, i) => {

            let move = () => {
                var transform = d3.event.transform;
                var s = transform.k;
                //points to translate on x-axis
                if (d3.event.sourceEvent) {
                    if (d3.event.sourceEvent.target.id < 3) { transform.x = transform.x < -width * s + 195 ? -width * s + 195 : transform.x > 1 ? 1 : transform.x; }
                    else if (d3.event.sourceEvent.target.id < 6) { transform.x = transform.x < -width * s + 395 ? -width * s + 395 : transform.x > width / 4 ? width / 4 : transform.x; }
                    else if (d3.event.sourceEvent.target.id < 9) { transform.x = transform.x < -width * s + 595 ? -width * s + 595 : transform.x > width / 2 ? width / 2 : transform.x; }
                    else { transform.x = transform.x < -width * s + 795 ? -width * s + 795 : transform.x > width / 2 ? width / 2 : transform.x; }
                }
                //points to translate on y-axis
                transform.y = transform.y > height / 2.5 * s ? height / 2.5 * s : transform.y < -height * s + 150 ? -height * s + 150 : transform.y
                ele[1].attr("transform", transform);
            }

            var zoom = d3.zoom()
                .scaleExtent([1, 4])
                .on("zoom", move);

            //adding zoom in each svg containers
            ele[0].call(zoom).on("dblclick.zoom", () => {
                ele[0].transition()
                    .duration(750)
                    .call(zoom.transform, d3.zoomIdentity);
            })

            //plot the graph
            ele[1].append("path")
                .datum(ecgData)
                .attr("class", `lineUsers`)
                .attr("id", `lineUser${i}`)
                .attr("d", lineCount);
            count++;

            let mouseG = ele[1].append("g")
                .attr("class", "mouse-over-effects");

            mouseG.append("path") // this is the red vertical line to follow mouse
                .attr("class", `mouse-line${i}a`)
                .style("stroke", "red")
                .style("stroke-width", ".8px")
            mouseG.append("path") // this is the red vertical line to follow mouse
                .attr("class", `mouse-line${i}b`)
                .style("stroke", "red")
                .style("stroke-width", ".8px")

            mouseG.append("path") // this is the red horizontal line to follow mouse
                .attr("class", `mouse-line${i}c`)
                .style("stroke", "red")
                .style("stroke-width", ".8px")

            //click count on every svg element
            click_ele[i] = click_count;

            //function to get bisector data on x axis
            let bisectDate = d3.bisector(function (d) {
                return d[0];
            }).right;

            //element to track mouse pointer by attaching circle to it
            var focus = mouseG.append("g");

            focus.append("circle")
                .attr("id", "focusCircle")
                .attr("r", 2)
                .attr("class", "focusCircle");

            mouseG.append("rect") // append a rect to catch mouse movements on canvas
                .attr("width", width) // can"t catch mouse events on a g element
                .attr("height", height)
                .attr("fill", "none")
                .attr("pointer-events", "all")
                .attr("id", i)
                .on("dblclick", null)
                .on("click", function () {
                    let mouse = d3.mouse(this);
                    let xValue = x.invert(mouse[0]);
                    let yValue = y.invert(mouse[1]);
                    let j = bisectDate(ecgData, xValue);

                    if (click_count > 1) {
                        click_count = 0;
                    }

                    if (click_ele[i] === 0) {
                        d3.select(`.mouse-line${i}a`)
                            .style("opacity", "1");
                        xSelect[0] = Math.floor(xValue)
                        d3.select(`.mouse-line${i}a`)
                            .attr("d", function () {
                                let d = "M" + mouse[0] + "," + height;
                                d += " " + mouse[0] + "," + 0;
                                return d;
                            });
                    }
                    else if (click_ele[i] === 1 && xSelect[0] !== Math.floor(xValue)) {
                        d3.select(`.mouse-line${i}b`)
                            .style("opacity", "1");
                        d3.select(`.mouse-line${i}c`)
                            .style("opacity", "1");
                        xSelect[1] = Math.floor(xValue)
                        d3.select(`.mouse-line${i}b`)
                            .style("opacity", "1")
                            .attr("d", function () {
                                let d = "M" + mouse[0] + "," + height;
                                d += " " + mouse[0] + "," + 0;
                                return d;
                            });

                        d3.select(`.mouse-line${i}c`)
                            .style("opacity", "1")
                            .attr("d", function () {
                                let d = "M" + xSelect[0] * 0.08 + "," + height / 1.9;
                                d += " " + mouse[0] + "," + height / 1.9;
                                return d;
                            });
                    }

                    click_count++;

                    if (click_ele[i] > 1) {
                        click_count = 0;
                        d3.select(`.mouse-line${i}b`)
                            .style("opacity", "0");
                        d3.select(`.mouse-line${i}c`)
                            .style("opacity", "0");
                    }
                    click_ele[i] = click_count
                })
                .on("mouseout", function () { // on mouse out hide line, circles and text
                    if (click_ele[i] === 0) {
                        d3.select(`.mouse-line${i}a`)
                            .style("opacity", "0");
                        d3.select(`.mouse-line${i}b`)
                            .style("opacity", "0");
                        d3.select(`.mouse-line${i}c`)
                            .style("opacity", "0");
                    }
                    focus.style("display", "none");
                })
                .on("mouseover", function () { // on mouse in show line, circles and text
                    if (click_ele[i] === 0) {
                        d3.select(`.mouse-line${i}a`)
                            .style("opacity", "1");
                    } else if (click_ele[i] === 1) {
                        d3.select(`.mouse-line${i}b`)
                            .style("opacity", "1");
                        d3.select(`.mouse-line${i}c`)
                            .style("opacity", "1");
                    }
                    focus.style("display", "block");
                })
                .on("contextmenu", function (d, i) {// react on right-clicking
                    d3.event.preventDefault();
                    let min,
                        max;
                    if (xSelect[0] < xSelect[1]) {
                        min = xSelect[0];
                        max = xSelect[1];
                    } else {
                        max = xSelect[0];
                        min = xSelect[1];
                    }

                    if (click_count === 2) {
                        let higlightData = ecgData.filter((d) => {
                            if (d[0] >= min && d[0] <= max) { return d; }
                        }
                        );

                        yIndex = Number(this.id) + 1;
                        mouseG.append("path")
                            .datum(higlightData)
                            .attr("class", `lineUsers`)
                            .attr("id", `lineUser${i}`)
                            .attr("d", lineCount2)
                            .style("stroke", "#4db95a");
                    }
                })
                .on("mousemove", function () { // mouse moving over canvas

                    let mouse = d3.mouse(this);
                    let xValue = x.invert(mouse[0]);
                    let yValue = y.invert(mouse[1]);
                    let j = bisectDate(ecgData, xValue);

                    if (click_ele[i] === 0) {
                        d3.select(`.mouse-line${i}a`)
                            .attr("d", function () {
                                let d = "M" + mouse[0] + "," + height;
                                d += " " + mouse[0] + "," + 0;
                                return d;
                            });
                    } else if (click_ele[i] === 1) {
                        d3.select(`.mouse-line${i}b`)
                            .style("opacity", "1")
                            .attr("d", function () {
                                let d = "M" + mouse[0] + "," + height;
                                d += " " + mouse[0] + "," + 0;
                                return d;
                            });

                        d3.select(`.mouse-line${i}c`)
                            .style("opacity", "1")
                            .attr("d", function () {
                                let d = "M" + xSelect[0] * 0.08 + "," + height / 1.9;
                                d += " " + mouse[0] + "," + height / 1.9;
                                return d;
                            });
                    }

                    var d0 = ecgData[j > 0 ? j - 1 : 0]
                    var d1 = ecgData[j >= ecgData.length ? ecgData.length - 1 : j];

                    // work out which value is closest to the mouse
                    var d = xValue - d0[0] > d1[0] - xValue ? d1 : d0;

                    focus.select("#focusCircle")
                        .attr("cx", x(d[0]))
                        .attr("cy", y(d[i + 1]));

                });
        })
    }

    render() {

        return (
            <div className="chart m-3" >
                <h3>Visualizing Data with React and D3</h3>
                <div className="main-container" width="1280" height="500" style={{ border: "solid 1px #eee", borderBottom: "solid 1px #ccc" }} />
            </div>
        )
    }
}

export default d3Chart;