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

        //adding zoom in each svg containers
        groups.forEach((ele) => {
            ele[0].call(d3.zoom().scaleExtent([1, 8]).on('zoom', function () { ele[1].attr("transform", d3.event.transform) }))
        })

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

        let count = 1;
        const lineCount = d3.line()
            .x(function (d) { return x(d[0]); })
            .y(function (d) { return y(d[count]); })
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
                .attr("x", 0.08 * 118)
                .attr("y", 5)
                .attr("font-size", "8")
                .text("I");

            ele[1].append("text")
                .attr("x", 0.08 * 118)
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

        //plot the graph
        groups.forEach((ele, i) => {
            ele[1].append("path")
                .datum(ecgData)
                .attr("class", `lineUsers`)
                .attr("d", lineCount);
            count++
        })

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