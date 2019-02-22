import React from 'react';
import './App.css';
import * as d3 from 'd3';
import ecg from './ecg.json';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
class d3Chart extends React.Component {
    constructor(props) {
        super(props)
        this.state = { data: '' }
    }

    componentDidMount() {
        this.draw()
    }


    draw() {

        //selecting main svg container
        const svg = d3.select(".main-container"),
            g = svg.append("g").attr("transform", "translate(20,8)"),
            ecgData = ecg.Data.ECG;
        // const result = ecgData.filter(word => word[0] <= 2400);

        //translate points of nested svg containers
        let points = [[0, 10, 170, 330], [310, 10, 170, 330], [620, 10, 170, 330], [930, 10, 170, 330]];

        let groups = [];
        let k = 0
        let m = 1
        for (let i = 0; i < 12; i++) {
            if (i % 3 === 0 && i !== 0) { k++; }
            if (m > 3) { m = 1 }
            const gc = g.append("svg").attr("x", points[k][0]).attr("y", points[k][m]).attr("width", 300).attr("height", 150).attr("viewBox", "0 90 190 70"),
                gs = gc.append("g");
            groups.push([gc, gs])
            m++;
        }



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

        var ymin = -ymax;
        let ygrid = [];
        for (let i = ymin; i <= ymax; i = Number((i + 0.1).toFixed(1))) {
            ygrid.push(i)
        }

        //Dimension of graph
        const width = xDomain * 3.2 / 40,
            height = ymax * 2 * 3.2 * 10;

        //adding zoom in each svg containers
        groups.forEach((ele) => {
            ele[0].call(d3.zoom().scaleExtent([1, 8])
                // .translateExtent([[0, 0], [width, height]])
                // .extent([[0, 0], [width, height]])
                .on('zoom', function () { ele[1].attr("transform", d3.event.transform) }))
        })

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
        //         .attr("class", 'axis axis--y')
        //         .call(d3.axisLeft(y));
        // })


        //plot name of the lead on graph
        let leadNames = ["I", "II", "III", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"]
        groups.forEach((ele, i) => {
            ele[1].append("text")
                .attr("fill", "#000")
                .attr("transform", "translate(28,5)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .style("text-anchor", "end")
                .style('font-size', '12')
                .text(leadNames[i]);
        })
        let click_count = 0;
        let click_ele = [];
        let higlightData = ecgData.filter((d) => {
            if (d[0] > 500 && d[0] <= 1000) { return d; }
        }
        );

        console.log("higlightData ",higlightData)

        //plot the graph
        groups.forEach((ele, i) => {
            ele[1].append("path")
                .datum(ecgData)
                .attr("class", `lineUsers`)
                .attr("id", `lineUser${i}`)
                .attr("d", lineCount);
            count++;

            if(i==0){
                yIndex=1;
                ele[1].append("path")
                .datum(higlightData)
                .attr("class", `lineUsers`)
                .attr("id", `lineUser${i}`)
                .attr("d", lineCount2)
                .style("stroke","green");
            }

            let mouseG = ele[1].append("g")
                .attr("class", "mouse-over-effects");

            // mouseG.append("path") // this is the red vertical line to follow mouse
            //     .attr("class", `mouse-line${i}`)
            //     .style("stroke", "red")
            //     .style("stroke-width", "1px")

            mouseG.append("path") // this is the red vertical line to follow mouse
                .attr("class", `mouse-line${i}a`)
                .style("stroke", "red")
                .style("stroke-width", "1px")
            mouseG.append("path") // this is the red vertical line to follow mouse
                .attr("class", `mouse-line${i}b`)
                .style("stroke", "red")
                .style("stroke-width", "1px")
            // var lines = document.getElementsByClassName('line');

            //     var mousePerLine = mouseG.selectAll('.mouse-per-line')
            //         .data(ecgData)
            //         .enter()
            //         .append("g")
            //         .attr("class", "mouse-per-line");


            // mousePerLine.append("text")
            //     .attr("transform", "translate(10,3)");
            click_ele[i] = click_count;
            var bisectDate = d3.bisector(function (d) {
                console.log("888844444 ", d)
                return d[0];
            }).right;
            mouseG.append('rect') // append a rect to catch mouse movements on canvas
                .attr('width', width) // can't catch mouse events on a g element
                .attr('height', height)
                .attr('fill', 'none')
                .attr('pointer-events', 'all')
                .attr('id', i)
                .on('click', function () {
                    if (click_count > 1) {
                        click_count = 0;
                    }
                    console.log(this.id, " *** ", i, click_count)
                    if (click_ele[i] === 0) {
                        d3.select(`.mouse-line${i}a`)
                            .style("opacity", "1");
                    }
                    else if (click_ele[i] === 1) {
                        d3.select(`.mouse-line${i}b`)
                            .style("opacity", "1");
                    }
                    click_count++;
                    if (click_ele[i] > 1) {
                        console.log("clic ", click_count)
                        click_count = 0;
                        d3.select(`.mouse-line${i}b`)
                            .style("opacity", "0");
                    }
                    click_ele[i] = click_count
                    console.log(click_count, " [[[ ", d3.select(`#lineUser${i}`).node().getPointAtLength(1))
                    // d3.select(`#lineUser${i}`)
                    // .style("stroke","green")
                    // click_ele.push([`.mouse-line${i}`,click_count])
                })
                .on('mouseout', function () { // on mouse out hide line, circles and text
                    if (click_ele[i] === 0) {
                        d3.select(`.mouse-line${i}a`)
                            .style("opacity", "0");
                        d3.select(`.mouse-line${i}b`)
                            .style("opacity", "0");
                    }

                    // d3.selectAll(".mouse-per-line circle")
                    //     .style("opacity", "0");
                    // d3.selectAll(".mouse-per-line text")
                    //     .style("opacity", "0");
                })
                .on('mouseover', function () { // on mouse in show line, circles and text
                    if (click_ele[i] === 0) {
                        d3.select(`.mouse-line${i}a`)
                            .style("opacity", "1");
                    } else if (click_ele[i] === 1) {
                        d3.select(`.mouse-line${i}b`)
                            .style("opacity", "1");
                    }
                    console.log("88888888888 ", click_ele[i])
                    // d3.selectAll(".mouse-per-line circle")
                    //     .style("opacity", "1");
                    // d3.selectAll(".mouse-per-line text")
                    //     .style("opacity", "1");
                })
                .on("contextmenu", function (d, i) {
                    d3.event.preventDefault();
                    console.log("contextmenu ",this,i)
                   // react on right-clicking
                })
                .on('mousemove', function () { // mouse moving over canvas
                    console.log("mousemove ", click_ele[i], click_count)

                    var mouse = d3.mouse(this);
                    var xValue = x.invert(mouse[0]);
                    var yValue = y.invert(mouse[1]);
                    var j = bisectDate(ecgData, xValue);

                    console.log(xValue, mouse, j)
                    if (click_ele[i] === 0) {
                        d3.select(`.mouse-line${i}a`)
                            .attr("d", function () {
                                var d = "M" + mouse[0] + "," + height;
                                d += " " + mouse[0] + "," + 0;
                                console.log(d)
                                return d;
                            });
                    } else if (click_ele[i] === 1) {
                        d3.select(`.mouse-line${i}b`)
                            .attr("d", function () {
                                var d = "M" + mouse[0] + "," + height;
                                d += " " + mouse[0] + "," + 0;
                                console.log(d)
                                return d;
                            });
                    }
                    // d3.selectAll(".mouse-per-line")
                    //     .attr("transform", function (d, i) {
                    //         console.log(width / mouse[0])
                    //         var xDate = x.invert(mouse[0]),
                    //             bisect = d3.bisector(function (d) { return d[1]; }).right,
                    //         idx = bisect(d[1], xDate);

                    //         var beginning = 0,
                    //             end = lines[i].getTotalLength(),
                    //             target = null;
                    //             let pos
                    //         while (true) {
                    //             target = Math.floor((beginning + end) / 2);
                    //             pos = lines[i].getPointAtLength(target);
                    //             if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                    //                 break;
                    //             }
                    //             if (pos.x > mouse[0]) end = target;
                    //             else if (pos.x < mouse[0]) beginning = target;
                    //             else break; //position found
                    //         }

                    //         d3.select(this).select('text')
                    //             .text(y.invert(pos.y).toFixed(2));

                    //         return "translate(" + mouse[0] + "," + pos.y + ")";
                    //     });

                });
        })
        // d3.selectAll(".tick")
        //   .on("click",function(e,i){
        //       console.log(d3.event)
        //       console.log(e,i)
        //   })

    }

    render() {

        return (
            <div className="chart" >
                <h3>Visualizing Data with React and D3</h3>
                <svg className="main-container" width="1280" height="500" style={{ border: 'solid 1px #eee', borderBottom: 'solid 1px #ccc', marginLeft: '20px' }} />
            </div>
        )
    }
}

export default d3Chart;