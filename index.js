// Preparations varibles, constants and functions

// to convert date object
var dateParse = d3.timeParse("%Y");
const GENRES = ['Action', 'Adventure', 'Board', 'Card', 'Educational', 'Fighting', 'Hunting', 'Music', 'Party', 'Platformer', 'Puzzle', 'RPG', 'Racing', 'Shooter', 'Simulation', 'Sports', 'Strategy'];
const PLATFORMS = ['Dreamcast', 'Game Boy (Color, Advance)', 'GameCube', 'Mobile', 'Nintendo (DS, 3DS, DSi)', 'Nintendo 64', 'PC', 'PlayStation (1, 2 ,3, 4)', 'PlayStation (Portable, Vita)', 'Wii (U)', 'Xbox (360, One)', 'iPad'];
var genre_selections = GENRES;
var platform_selections = PLATFORMS;

// to aggregate all data points of the same release date
const aggregate = (fields, data) => {
    // get only the data that we need
    var parsedData = data.map(function (d) {
        var dataObject = {
            date: d['release_year']
        };
        GENRES.forEach(function (s) {
            dataObject[s] = 0;
        })
        fields.forEach(function (s) {
            dataObject[s] = +d[s];
        })
        return dataObject;
    });
    return parsedData;
    console.log(parsedData);
}




// sizing information, including margins so there is space for labels, etc
var margin = { top: 20, right: 20, bottom: 100, left: 20 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#scatter_plot")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var genreDict = {};
GENRES.forEach(genre => {
    genreDict[genre] = true;
});


var x = d3.scaleTime()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var xAxis = d3.axisBottom(x),
    yAxis = d3.axisLeft(y);


function stackMax(layer) {
    return d3.max(layer, function (d) { return d[1]; });
}

d3.csv("pre_processed.csv", function (error, data) {
    var max_count = 0;
    var parsedData = [];
    platform_selections.forEach(platform => {
        genre_selections.forEach(genre => {
            let object = {
                'platform': platform,
                'genre': genre,
                'count': 0
            }
            parsedData.push(object);
        })
    });
    console.log(parsedData);
    data.forEach(function (d) {
        d['release_year'] = dateParse(d['release_year']);
        const p_index = platform_selections.indexOf(d.platform);
        const g_index = genre_selections.indexOf(d.genre);
        if (p_index != -1 && g_index != -1) {
            const data_index = p_index * genre_selections.length + g_index;
            parsedData[data_index].count = parsedData[data_index].count + 1;
            max_count = Math.max(max_count, parsedData[data_index].count);
        }
    });
    // Define Extent for each Dataset
    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);

    var y = d3.scaleBand().rangeRound([0, height]).padding(0.1);

    var xAxis = d3.axisBottom(x),
        yAxis = d3.axisLeft(y);
    x.domain(data.map(function (d) { return d.genre; }));
    y.domain(data.map(function (d) { return d.platform; }));

    var main = svg.append("g")
        .attr("class", "main")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    main.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "axis axis--x")
        .call(xAxis)

    main.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis)

    main.selectAll(".column")
        .data(parsedData)
        .enter().append("circle")
        .attr("class", "bar")
        .attr("cx", function (d) { return x(d.genre); })
        .attr("cy", function (d) { return y(d.platform); })
        .attr('r', function (d) { return d.count / max_count * 20; })
        .attr("width", x.bandwidth())
        .attr("height", function (d) { return height - y(d.frequency); });

});
// d3.csv("games_2.csv", function (error, data) {
//     if (error) throw error;
//     // Parse the data first
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
//         d['release_year'] = dateParse(d['release_year']);
//     });


//     var parsedData = aggregate(genres, data);
//     var emptyData = aggregate([], data);
//     console.log(parsedData);

//     var stack = d3.stack()
//         .keys(genres)
//         .order(d3.stackOrderNone)
//         .offset(d3.stackOffsetNone);

//     var layers = stack(parsedData);

//     x.domain([parsedData[0].date, parsedData[parsedData.length - 1].date]);
//     y.domain([0, d3.max(layers, stackMax)]);


//     function getDate(d) {
//         return d.date;
//     }


//     var colors = genres.map(function (d, i) {
//         return d3.interpolateWarm(i / genres.length);
//     });

//     var colorScale = d3.scaleOrdinal()
//         .domain(genres)
//         .range(colors);

//     var legendOffset = -20;

//     var legend = d3.legendColor()
//         .shapeWidth(30)
//         .cells(genres.length)
//         .orient("vertical")
//         .scale(colorScale)

//     var area = d3.area()
//         .x(function (d, i) { return x(d.data.date) })
//         .y0(function (d) { return y(d[0]); })
//         .y1(function (d) { return y(d[1]); })
//         .curve(d3.curveMonotoneX);


//     var main = svg.append("g")
//         .attr("class", "main")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     main.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .attr("class", "axis axis--x")
//         .call(xAxis)
//         .select(".domain")
//         .remove();

//     main.append("g")
//         .attr("class", "axis axis--y")
//         .call(yAxis);
// 
//     var legendObject = main.append("g")
//         .attr("class", "legend")
//         .attr("transform", "translate(" + legendOffset.toString() + ",0)");

//     main.select(".legend")
//         .call(legend);

//     var layers = stack(parsedData);
//     main.selectAll(".draw_path")
//         .data(layers)
//         .enter().append("path")
//         .attr("class", "draw_path")
//         .attr("d", area)
//         .attr("fill", function (d, i) {
//             return colors[i];
//         });
//     var legendRect = legendObject.selectAll('rect').data(colors);

//     legendRect.on("click", function () {
//         item = this.nextSibling.innerHTML;
//         // if selectionArray.contai
//         genreDict[item] = !genreDict[item];
//         genre_selections = []
//         Object.keys(genreDict).forEach(genre => {
//             if (genreDict[genre] === true) {
//                 genre_selections.push(genre);

//             }
//         });
//         console.log(genre_selections);
//         parsedData = aggregate(genre_selections, data);
//         layers = stack(parsedData);
//         // console.log(layers);

//         main.selectAll(".draw_path")
//             .data(layers)
//             .transition()
//             .duration(750)
//             .attr("d", area)
//             .attr("fill", function (d, i) {
//                 console.log(d.key);
//                 return colors[i];
//             });
//         console.log(svg.selectAll(".draw_path"));
//     });
// });

