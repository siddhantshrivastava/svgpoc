import React from 'react';
import './App.css';
import * as d3 from 'd3';
import ecg from './ecg.json'
class d3Chart extends React.Component {
    constructor(props) {
        super(props)
        this.state = { data: '' }
    }

    componentDidMount() {
        this.draw()
    }


    draw() {

        const svg = d3.select(".main-container"),
            // margin = { top: 10, right: 20, bottom: 50, left: 10 },
            width = 700,
            height = 100,
            g = svg.append("g").attr("transform", "translate(20,8)"),
            gc1 = g.append("svg").attr("x", 0).attr("y", 10).attr("width", 300).attr("height", 150).attr("viewBox", "0 15 170 70"),
            g1 = gc1.append("g"),
            gc2 = g.append("svg").attr("x", 0).attr("y", 170).attr("width", 300).attr("height", 150).attr("viewBox", "0 15 170 70"),
            g2 = gc2.append("g").attr("transform", "translate(0,0)"),
            gc3 = g.append("svg").attr("x", 0).attr("y", 330).attr("width", 300).attr("height", 150).attr("viewBox", "0 15 170 70"),
            g3 = gc3.append("g"),
            gc4 = g.append("svg").attr("x", 310).attr("y", 10).attr("width", 300).attr("height", 150).attr("viewBox", "0 15 170 70"),
            g4 = gc4.append("g"),
            gc5 = g.append("svg").attr("x", 310).attr("y", 170).attr("width", 300).attr("height", 150).attr("viewBox", "0 15 170 70"),
            g5 = gc5.append("g"),
            gc6 = g.append("svg").attr("x", 310).attr("y", 330).attr("width", 300).attr("height", 150).attr("viewBox", "0 15 170 70"),
            g6 = gc6.append("g"),
            gc7 = g.append("svg").attr("x", 620).attr("y", 10).attr("width", 300).attr("height", 150).attr("viewBox", "0 15 170 70"),
            g7 = gc7.append("g"),
            gc8 = g.append("svg").attr("x", 620).attr("y", 170).attr("width", 300).attr("height", 150).attr("viewBox", "0 15 170 70"),
            g8 = gc8.append("g"),
            gc9 = g.append("svg").attr("x", 620).attr("y", 330).attr("width", 300).attr("height", 150).attr("viewBox", "0 15 170 70"),
            g9 = gc9.append("g"),
            gc10 = g.append("svg").attr("x", 930).attr("y", 10).attr("width", 300).attr("height", 150).attr("viewBox", "0 15 170 70"),
            g10 = gc10.append("g"),
            gc11 = g.append("svg").attr("x", 930).attr("y", 170).attr("width", 300).attr("height", 150).attr("viewBox", "0 15 170 70"),
            g11 = gc11.append("g"),
            gc12 = g.append("svg").attr("x", 930).attr("y", 330).attr("width", 300).attr("height", 150).attr("viewBox", "0 15 170 70"),
            g12 = gc12.append("g"),
            ecgData = ecg.Data.ECG;


        // const result = ecgData.filter(word => word[0] <= 2400);
        gc1.call(d3.zoom().scaleExtent([1, 8]).on('zoom', function () { g1.attr("transform", d3.event.transform) }))
        gc2.call(d3.zoom().scaleExtent([1, 8]).on('zoom', function () { g2.attr("transform", d3.event.transform) }))
        gc3.call(d3.zoom().scaleExtent([1, 8]).on('zoom', function () { g3.attr("transform", d3.event.transform) }))
        gc4.call(d3.zoom().scaleExtent([1, 8]).on('zoom', function () { g4.attr("transform", d3.event.transform) }))
        gc5.call(d3.zoom().scaleExtent([1, 8]).on('zoom', function () { g5.attr("transform", d3.event.transform) }))
        gc6.call(d3.zoom().scaleExtent([1, 8]).on('zoom', function () { g6.attr("transform", d3.event.transform) }))
        gc7.call(d3.zoom().scaleExtent([1, 8]).on('zoom', function () { g7.attr("transform", d3.event.transform) }))
        gc8.call(d3.zoom().scaleExtent([1, 8]).on('zoom', function () { g8.attr("transform", d3.event.transform) }))
        gc9.call(d3.zoom().scaleExtent([1, 8]).on('zoom', function () { g9.attr("transform", d3.event.transform) }))
        gc10.call(d3.zoom().scaleExtent([1, 8]).on('zoom', function () { g10.attr("transform", d3.event.transform) }))
        gc11.call(d3.zoom().scaleExtent([1, 8]).on('zoom', function () { g11.attr("transform", d3.event.transform) }))
        gc12.call(d3.zoom().scaleExtent([1, 8]).on('zoom', function () { g12.attr("transform", d3.event.transform) }))

        // d3.csv(svgdata).then(function (data) {
        // console.log("datatata ", data)
        //let f=[0,40,80,120,160,200,240,280,320,3  60,400,440,480,520,560,600,640,680,720,760,800,840,880,920,960,1000]
        let xDomain = d3.max(ecgData, function (d, i) {
            return d3.max(d, (t, i) => {
                if (i === 0)
                    return t;
            });
        });
        
        let xgrid = [...Array(xDomain/40+1).keys()].map((i) => i * 40);

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
        console.log(Math.ceil(yDomainMax),yDomainMax*2/.1,Math.abs(yDomainMin))
        // const y1 = d3.max(ecgData, function (d) { return d[1]; })
        let ygrid = [...Array(Math.ceil(yDomainMax/.1)).keys()].map((i) => i /10).concat([...Array(Math.ceil(yDomainMax/.1)).keys()].map((i) => -i /10));
        ygrid.slice(ygrid.indexOf(0,1))
        console.log(ygrid.indexOf("-0"))
        const x = d3.scaleLinear()
            .domain([0, xDomain])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([-yDomainMax, yDomainMax])
            .range([height, 0]);

        const make_x_grid_lines = () => {
            return d3.axisBottom(x)
                .tickValues(xgrid)
        }

        const make_y_gridlines = () => {
            return d3.axisLeft(y)
                .ticks(40)

        }
        let count = 1;
        const lineCount = d3.line()
            .x(function (d) { return x(d[0]); })
            .y(function (d) { return y(d[count]);})
            .curve(d3.curveBasis);


        

        // x.domain(d3.extent(result, function (d) { return d[0]; }));
        // y.domain(d3.extent(result, function (d) { return d[count]; }));
        // add the X gridlines
        g1.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "white");

        g1.append("g")
            .attr("class", `grid`)
            .attr("fill", "blue")
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_grid_lines()
                .tickSize(-height)
                .tickFormat(""))

        g2.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "white");

        g2.append("g")
            .attr("class", `grid`)
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_grid_lines()
                .tickSize(-height)
                .tickFormat(""))

        g3.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "white");

        g3.append("g")
            .attr("class", `grid`)
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_grid_lines()
                .tickSize(-height)
                .tickFormat(""))

        g4.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "white");

        g4.append("g")
            .attr("class", `grid`)
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_grid_lines()
                .tickSize(-height)
                .tickFormat(""))

        g5.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "white");

        g5.append("g")
            .attr("class", `grid`)
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_grid_lines()
                .tickSize(-height)
                .tickFormat(""))

        g6.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "white");

        g6.append("g")
            .attr("class", `grid`)
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_grid_lines()
                .tickSize(-height)
                .tickFormat(""))

        g7.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "white");

        g7.append("g")
            .attr("class", `grid`)
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_grid_lines()
                .tickSize(-height)
                .tickFormat(""))

        g8.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "white");

        g8.append("g")
            .attr("class", `grid`)
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_grid_lines()
                .tickSize(-height)
                .tickFormat(""))

        g9.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "white");

        g9.append("g")
            .attr("class", `grid`)
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_grid_lines()
                .tickSize(-height)
                .tickFormat(""))

        g10.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "white");

        g10.append("g")
            .attr("class", `grid`)
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_grid_lines()
                .tickSize(-height)
                .tickFormat(""))

        g11.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "white");

        g11.append("g")
            .attr("class", `grid`)
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_grid_lines()
                .tickSize(-height)
                .tickFormat(""))

        g12.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "white");

        g12.append("g")
            .attr("class", `grid`)
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_grid_lines()
                .tickSize(-height)
                .tickFormat(""))

        //add the Y gridlines

        g1.append("g")
            .attr("class", `grid`)
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat(""))

        g2.append("g")
            .attr("class", `grid`)
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat(""))

        g3.append("g")
            .attr("class", `grid`)
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat(""))

        g4.append("g")
            .attr("class", `grid`)
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat(""))

        g5.append("g")
            .attr("class", `grid`)
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat(""))

        g6.append("g")
            .attr("class", `grid`)
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat(""))

        g7.append("g")
            .attr("class", `grid`)
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat(""))

        g8.append("g")
            .attr("class", `grid`)
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat(""))

        g9.append("g")
            .attr("class", `grid`)
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat(""))

        g10.append("g")
            .attr("class", `grid`)
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat(""))

        g11.append("g")
            .attr("class", `grid`)
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat(""))

        g12.append("g")
            .attr("class", `grid`)
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat(""))



        //plot the x axis
        // g.append("g")
        //     .attr("class", `axis axis--x`)
        //     .attr("transform", "translate(0," + height + ")")
        //     .call(d3.axisBottom(x));

        // g.append("g")
        //     .attr("class", 'axis axis--y')
        //     .call(d3.axisLeft(y))
        //plot the color legend

        g1.append("text")
            .attr("fill", "#000")
            .attr("transform", "translate(10,5)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .style('font-size', '12')
            .text("I");

        g2.append("text")
            .attr("fill", "#000")
            .attr("transform", "translate(10,5)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .style('font-size', '12')
            .text("II");

        g3.append("text")
            .attr("fill", "#000")
            .attr("transform", "translate(15,5)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .style('font-size', '12')
            .text("III");

        g4.append("text")
            .attr("fill", "#000")
            .attr("transform", "translate(28,5)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .style('font-size', '12')
            .text("aVR");

        g5.append("text")
            .attr("fill", "#000")
            .attr("transform", "translate(28,5)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .style('font-size', '12')
            .text("aVL");

        g6.append("text")
            .attr("fill", "#000")
            .attr("transform", "translate(28,5)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .style('font-size', '12')
            .text("aVF");

        g7.append("text")
            .attr("fill", "#000")
            .attr("transform", "translate(28,5)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .style('font-size', '12')
            .text("V1");

        g8.append("text")
            .attr("fill", "#000")
            .attr("transform", "translate(28,5)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .style('font-size', '12')
            .text("V2");

        g9.append("text")
            .attr("fill", "#000")
            .attr("transform", "translate(28,5)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .style('font-size', '12')
            .text("V3");

        g10.append("text")
            .attr("fill", "#000")
            .attr("transform", "translate(28,5)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .style('font-size', '12')
            .text("V4");

        g11.append("text")
            .attr("fill", "#000")
            .attr("transform", "translate(28,5)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .style('font-size', '12')
            .text("V5");

        g12.append("text")
            .attr("fill", "#000")
            .attr("transform", "translate(28,5)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .style('font-size', '12')
            .text("V6");
        // g.append('g')
        //     .attr('class', 'legend')
        // .append('text')
        //     .attr('y',-10)
        //     .attr('x',width-100)
        //     .text('Users');
        // g.append('g')
        //     .append('rect')
        //     .attr('y',-23)
        //     .attr('x',width-55)
        //     .attr('width',18)
        //     .attr('height',18)
        //     .attr('fill','steelblue');

        //plot the x axis legend
        // svg.append("text")
        //     .attr("transform","translate(" + (width/2) + " ," + (height + margin.top + 40) + ")")
        //     .style("text-anchor", "middle")
        //     .text("Week #");

        g1.append("path")
            .datum(ecgData)
            .attr("class", `lineUsers`)
            .attr("d", lineCount)

        if (count > 12) { count = 0; }
        count++;

        g2.append("path")
            .datum(ecgData)
            .attr("class", `lineUsers`)
            .attr("d", lineCount)

        if (count > 12) { count = 0; }
        count++;

        g3.append("path")
            .datum(ecgData)
            .attr("class", `lineUsers`)
            .attr("d", lineCount)

        if (count > 12) { count = 0; }
        count++;

        g4.append("path")
            .datum(ecgData)
            .attr("class", `lineUsers`)
            .attr("d", lineCount)

        if (count > 12) { count = 0; }
        count++;

        g5.append("path")
            .datum(ecgData)
            .attr("class", `lineUsers`)
            .attr("d", lineCount)

        if (count > 12) { count = 0; }
        count++;

        g6.append("path")
            .datum(ecgData)
            .attr("class", `lineUsers`)
            .attr("d", lineCount)

        if (count > 12) { count = 0; }
        count++;

        g7.append("path")
            .datum(ecgData)
            .attr("class", `lineUsers`)
            .attr("d", lineCount)

        if (count > 12) { count = 0; }
        count++;

        g8.append("path")
            .datum(ecgData)
            .attr("class", `lineUsers`)
            .attr("d", lineCount)

        if (count > 12) { count = 0; }
        count++;

        g9.append("path")
            .datum(ecgData)
            .attr("class", `lineUsers`)
            .attr("d", lineCount)

        if (count > 12) { count = 0; }
        count++;

        g10.append("path")
            .datum(ecgData)
            .attr("class", `lineUsers`)
            .attr("d", lineCount)

        if (count > 12) { count = 0; }
        count++;

        g11.append("path")
            .datum(ecgData)
            .attr("class", `lineUsers`)
            .attr("d", lineCount)

        if (count > 12) { count = 0; }
        count++;

        g12.append("path")
            .datum(ecgData)
            .attr("class", `lineUsers`)
            .attr("d", lineCount)
        // console.log(d3.selectAll(".grid line"))
        // d3.selectAll(".tick:nth-of-type(2)").attr("stroke-width",".3")
        // })
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