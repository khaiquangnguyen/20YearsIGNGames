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



// d3.csv("pre_processed.csv", function (error, data) {
//     var max_count = 0;
//     // preprocessing the data to get the right data format
//     var scatter_data = generate_scatter_array();
//     data.forEach(function (d) {
//         d['release_year'] = dateParse(d['release_year']);
//         const p_index = platform_selections.indexOf(d.platform);
//         const g_index = genre_selections.indexOf(d.genre);
//         if (p_index != -1 && g_index != -1) {
//             const data_index = p_index * genre_selections.length + g_index;
//             scatter_data[data_index].count = scatter_data[data_index].count + 1;
//             max_count = Math.max(max_count, scatter_data[data_index].count);
//         }
//     });

//     // define the domain
//     x_scatter.domain(data.map(function (d) { return d.genre; }));
//     y_scatter.domain(data.map(function (d) { return d.platform; }));

//     // create the main plot
//     var scatter_plot = svg_scatter.append("g")
//         .attr("class", "main")
//         .attr("transform", "translate(" + margin_scatter.left + "," + margin_scatter.top + ")");
//     // draw the axes
//     scatter_plot.append("g")
//         .attr("transform", "translate(-22," + height_scatter + ")")
//         .attr("class", "axis axis--x")
//         .call(x_axis_scatter)

//     scatter_plot.append("g")
//         .attr("class", "axis axis--y")
//         .call(y_axis_scatter)

//     scatter_plot.selectAll(".column")
//         .data(scatter_data)
//         .enter().append("circle")
//         .attr("class", "bar")
//         .attr("cx", function (d) { return x_scatter(d.genre); })
//         .attr("cy", function (d) { return y_scatter(d.platform); })
//         .attr('r', function (d) { return d.count / max_count * 20; })
//         .attr("width", x_scatter.bandwidth())
//         .attr("height", function (d) { return height_scatter - y_scatter(d.frequency); });

// });





// sizing information, including margins so there is space for labels, etc
var margin_scatter = { top: 20, right: 20, bottom: 100, left: 20 },
    width_scatter = 960 - margin_scatter.left - margin_scatter.right,
    height_scatter = 500 - margin_scatter.top - margin_scatter.bottom,
    marginOverview = { top: 430, right: margin_scatter.right, bottom: 20, left: margin_scatter.left },
    heightOverview = 500 - marginOverview.top - marginOverview.bottom;

var svg = d3.select("body")
    .append("svg") // the overall space
    .attr("width", width_scatter + margin_scatter.left + margin_scatter.right)
    .attr("height", height_scatter + margin_scatter.top + margin_scatter.bottom);

var dateParse = d3.timeParse("%Y");

// var svg = d3.select("svg");

// var container = d3_container.container();

// container
//     .height(500)
//     .width(960)
//     .margin(50, 0, 30, 50);

// var width = container.contentWidth(),
//     height = container.contentHeight();

// svg.call(container);

// var svg = d3.select("svg"),
//     margin = { top: 20, right: 20, bottom: 110, left: 40 },
//     margin2 = { top: 430, right: 20, bottom: 30, left: 40 },
//     width = 1000,
//     height = 600,
//     height2 = 100;

// var content = svg;


// var statusArray = ['Action', 'Adventure', 'Board', 'Card', 'Educational', 'Fighting', 'Hunting', 'Music', 'Party', 'Platformer', 'Puzzle', 'RPG', 'Racing', 'Shooter', 'Simulation', 'Sports', 'Strategy'];

const aggregate = (fields, data) => {
    // get only the data that we need
    var parsedData = data.map(function (d) {
        var dataObject = {
            date: d['release_year']
        };
        fields.forEach(function (s) {
            dataObject[s] = +d[s];
        })
        return dataObject;
    });
    return parsedData;
    console.log(parsedData);
}

function stackMax(layer) {
    return d3.max(layer, function (d) { return d[1]; });
}


var platform_selections = ['Fighting', 'Educational'];
d3.csv("games_2.csv", function (error, data) {
    if (error) throw error;
    // Parse the data first
    data.forEach(function (d) {
        d[""] = +d[""]
        d.Action = +d.Action
        d.Adventure = +d.Adventure
        d.Board = +d.Board
        d.Card = +d.Card
        d.Dreamcast = +d.Dreamcast
        d.Educational = +d.Educational
        d.Fighting = +d.Fighting
        d['Game Boy (Color, Advance)'] = +d['Game Boy (Color, Advance)']
        d.GameCube = +d.GameCube
        d.Hunting = +d.Hunting
        d.Mobile = +d.Mobile
        d.Music = +d.Music
        d['Nintendo 64'] = +d['Nintendo 64']
        d['Nintendo (DS, 3DS, DSi)'] = +d['Nintendo (DS, 3DS, DSi)']
        d.PC = +d.PC
        d.Party = +d.Party
        d.Platformer = +d.Platformer
        d['PlayStation (1, 2 ,3, 4)'] = +d['PlayStation (1, 2 ,3, 4)']
        d['PlayStation (Portable, Vita)'] = +d['PlayStation (Portable, Vita)']
        d.Puzzle = +d.Puzzle
        d.RPG = +d.RPG
        d.Racing = +d.Racing
        d.Shooter = +d.Shooter
        d.Simulation = + d.Simulation
        d.Sports = +d.Sports
        d.Strategy = +d.Strategy
        d['Wii (U)'] = +d['Wii (U)']
        d['Xbox (360, One)'] = +d['Xbox (360, One)']
        d['iPad'] = +d['iPad']
        d['release_year'] = dateParse(d['release_year']);
    });
    var parsedData = aggregate(platform_selections, data);

    console.log(parsedData);
    var stack = d3.stack()
        .keys(platform_selections)
        .offset(d3.stackOffsetNone);

    var layers = stack(parsedData);

    function getDate(d) {
        return d.date;
    }

    var x = d3.scaleTime()
        .domain([parsedData[0].date, parsedData[parsedData.length - 1].date])
        .range([0, width_scatter]);

    var y = d3.scaleLinear()
        .domain([0, d3.max(layers, stackMax)])
        .range([height_scatter, 0]);

    var xOverview = d3.scaleTime()
        .domain([parsedData[0].date, parsedData[parsedData.length - 1].date])
        .range([0, width_scatter]);

    var yOverview = d3.scaleLinear()
        .domain([0, d3.max(layers, stackMax)])
        .range([heightOverview, 0]);

    var xAxis = d3.axisBottom(x),
        yAxis = d3.axisLeft(y),
        xAxisOverview = d3.axisBottom(xOverview),
        yAxisOverview = d3.axisLeft(yOverview);

    var colors = platform_selections.map(function (d, i) {
        return d3.interpolateWarm(i / platform_selections.length);
    });

    var colorScale = d3.scaleOrdinal()
        .domain(platform_selections)
        .range(colors);

    var legendOffset = -20;

    var legend = d3.legendColor()
        .shapeWidth(30)
        .cells(platform_selections.length)
        .orient("vertical")
        .scale(colorScale)

    var area = d3.area()
        .x(function (d, i) { return x(d.data.date) })
        .y0(function (d) { return y(d[0]); })
        .y1(function (d) { return y(d[1]); })
        .curve(d3.curveBasis);

    var areaOverview = d3.area()
        .x(function (d, i) { return x(d.data.date) })
        .y0(function (d) { return y(d[0]); })
        .y1(function (d) { return yOverview(d[1]); })
        .curve(d3.curveBasis);


    var main = svg.append("g")
        .attr("class", "main")
        .attr("transform", "translate(" + margin_scatter.left + "," + margin_scatter.top + ")");

    var overview = svg.append("g")
        .attr("class", "overview")
        .attr("transform", "translate(" + marginOverview.left + "," + marginOverview.top + ")");

    var gX = main.append("g")
        .attr("transform", "translate(0," + height_scatter + ")")
        .attr("class", "axis axis--x")
        .call(xAxis)
        .select(".domain")
        .remove();

    var gY = main.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);

    var overviewX = main.append("g")
        .attr("transform", "translate(0," + heightOverview + ")")
        .attr("class", "axis axis--x")
        .call(xAxisOverview)
        .select(".domain")
        .remove();

    var overviewY = main.append("g")
        .attr("class", "axis axis--y")
        .call(yAxisOverview);

    main.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + legendOffset.toString() + ",0)");

    main.select(".legend")
        .call(legend);

    var layerGroups = main.selectAll(".layer")
        .data(layers)
        .enter().append("g")
        .attr("class", "layer");

    layerGroups.append("path")
        .attr("d", area)
        .attr("fill", function (d, i) {
            return colors[i];
        });

    var overviewGroups = overview.selectAll(".layer")
        .data(layers)
        .enter().append("g")
        .attr("class", "layer");

    overviewGroups.append("path")
        .attr("d", areaOverview)
        .attr("fill", function (d, i) {
            return colors[i];
        });
});

