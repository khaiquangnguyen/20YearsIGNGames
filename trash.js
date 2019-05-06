// // https://bl.ocks.org/greencracker/e08d5e789737e91d6e73d7dcc34969bf
// var parseDate = d3.timeParse('%Y');
// var svg = d3.select("svg");
// var container = d3_container.container();

// container
//     .height(500)
//     .width(960)
//     .margin(50, 0, 30, 50);

// var width = container.contentWidth(),
//     height = container.contentHeight();

// svg.call(container);

// let genreArray = ['Action', 'Adventure', 'Board', 'Card', 'Education', 'Fighting', 'Hunting', 'Music', 'Party', 'Platformer', 'Puzzle', 'RPG', 'Racing', 'Shooter', 'Simulation', 'Sports', 'Strategy']
// var content = container.content();

// function getDate(d) {
//     return d.date;
// }
// d3.csv("games_2.csv", function (error, data) {
//     data.forEach(function (d) {
//         d[""] = +d[""]
//         d.Action = +d.Action
//         d.Adventure = +d.Adventure
//         d.Board = +d.Board
//         d.Card = +d.Card
//         d.Dreamcast = +d.Dreamcast
//         d.Educational = +d.Educational
//         d.Fighting = +d.Fighting
//         d['Game Boy (Color, Advance)'] = +d['Game Boy (Color, Advance)']
//         d.GameCube = +d.GameCube
//         d.Hunting = +d.Hunting
//         d.Mobile = +d.Mobile
//         d.Music = +d.Music
//         d['Nintendo 64'] = +d['Nintendo 64']
//         d['Nintendo (DS, 3DS, DSi)'] = +d['Nintendo (DS, 3DS, DSi)']
//         d.PC = +d.PC
//         d.Party = +d.Party
//         d.Platformer = +d.Platformer
//         d['PlayStation (1, 2 ,3, 4)'] = +d['PlayStation (1, 2 ,3, 4)']
//         d['PlayStation (Portable, Vita)'] = +d['PlayStation (Portable, Vita)']
//         d.Puzzle = +d.Puzzle
//         d.RPG = +d.RPG
//         d.Racing = +d.Racing
//         d.Shooter = +d.Shooter
//         d.Simulation = + d.Simulation
//         d.Sports = +d.Sports
//         d.Strategy = +d.Strategy
//         d['Wii (U)'] = +d['Wii (U)']
//         d['Xbox (360, One)'] = +d['Xbox (360, One)']
//         d['iPad'] = +d['iPad']
//         d['release_year'] = parseDate(d['release_year']);
//     });

//     console.log(data[0]);
//     var margin = { top: 20, right: 60, bottom: 30, left: 30 },
//         width = 500 - margin.left - margin.right,
//         height = 500 - margin.top - margin.bottom;


//     var x = d3.scaleTime()
//         .range([0, width]);

//     var y = d3.scaleLinear()
//         .range([height, 0]);

//     var color = d3.scaleOrdinal(d3.schemeCategory20);

//     var xAxis = d3.axisBottom()
//         .scale(x);

//     var yAxis = d3.axisLeft()
//         .scale(y)

//     var gX = content.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .attr("class", "axis axis--x")
//         .call(xAxis)
//         .select(".domain")
//         .remove();

//     var gY = content.append("g")
//         .attr("class", "axis axis--y")
//         .call(yAxis);

//     var colors = genreArray.map(function (d, i) {
//         return d3.interpolateWarm(i / genreArray.length);
//     });

//     var colorScale = d3.scaleOrdinal()
//         .domain(genreArray)
//         .range(colors);

//     var legendOffset = container.margin().left() + width - 32 * genreArray.length;

//     var legend = d3.legendColor()
//         .shapeWidth(30)
//         .cells(genreArray.length)
//         .orient("horizontal")
//         .scale(colorScale)

//     var area = d3.area()
//         .x(function (d) {
//             return x(d['release_year']);
//         })
//         .y0(function (d) { return y(d[0]); })
//         .y1(function (d) { return y(d[1]); });


//     var stack = d3.stack()
//         .keys(genreArray)
//         .offset(d3.stackOffsetNone);

//     var layers = stack(data);

//     var layerGroups = content.selectAll(".layer")
//         .data(layers)
//         .enter().append("g")
//         .attr("class", "layer");

//     svg.append("g")
//         .attr("class", "legend")
//         .attr("transform", "translate(" + legendOffset.toString() + ",0)");

//     svg.select(".legend")
//         .call(legend);

//     layerGroups.append("path")
//         .attr("d", area)
//         .attr("fill", function (d, i) {
//             return colors[i];
//         });

//     function stackMax(layer) {
//         return d3.max(layer, function (d) { return d[1]; });
//     }

//     // let new_data = aggregate(['Action', 'Adventure', 'RPG'], data);
//     // const max_yrange = new_data[1] + 10;
//     // new_data = new_data[0];
//     // console.log(new_data);
//     // console.log(max_yrange);
//     // // create a range of the data
//     // // scale the range of the data
//     // x.domain([1996, 2016]);
//     // y.domain([0, max_yrange]);
// });

// const aggregate = (fields, data) => {
//     const dict = {};
//     let max = 0;
//     for (let i = 1996; i < 2017; i++) {
//         dict[i] = {};
//         fields.forEach(field => {
//             dict[i][field] = 0;
//         })
//         dict[i]['year'] = parseDate(i);
//     }
//     //console.log(dict);
//     data.forEach(row => {
//         //console.log(row)
//         fields.forEach(field => {
//             if (row['release_year'] in dict) dict[row['release_year']][field] += row[field];
//         })
//     })

//     // for (let i = 1; i < fields.length; i++) {
//     //     for (let j = 1996; j < 2017; j++) {
//     //         dict[j][fields[i]] += dict[j][fields[i - 1]];
//     //         if (dict[j][fields[i]] > max) {
//     //             max = dict[j][fields[i]];
//     //         }
//     //     }
//     // }
//     return dict;
// }
