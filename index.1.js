


// sizing information, including margins so there is space for labels, etc
var margin = { top: 20, right: 20, bottom: 100, left: 20 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    marginOverview = { top: 430, right: margin.right, bottom: 20, left: margin.left },
    heightOverview = 500 - marginOverview.top - marginOverview.bottom;

var svg = d3.select("body")
    .append("svg") // the overall space
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

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


var genre_selections = ['Fighting', 'Educational'];
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
    var parsedData = aggregate(genre_selections, data);

    console.log(parsedData);
    var stack = d3.stack()
        .keys(genre_selections)
        .offset(d3.stackOffsetNone);

    var layers = stack(parsedData);

    function getDate(d) {
        return d.date;
    }

    var x = d3.scaleTime()
        .domain([parsedData[0].date, parsedData[parsedData.length - 1].date])
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([0, d3.max(layers, stackMax)])
        .range([height, 0]);

    var xOverview = d3.scaleTime()
        .domain([parsedData[0].date, parsedData[parsedData.length - 1].date])
        .range([0, width]);

    var yOverview = d3.scaleLinear()
        .domain([0, d3.max(layers, stackMax)])
        .range([heightOverview, 0]);

    var xAxis = d3.axisBottom(x),
        yAxis = d3.axisLeft(y),
        xAxisOverview = d3.axisBottom(xOverview),
        yAxisOverview = d3.axisLeft(yOverview);

    var colors = genre_selections.map(function (d, i) {
        return d3.interpolateWarm(i / genre_selections.length);
    });

    var colorScale = d3.scaleOrdinal()
        .domain(genre_selections)
        .range(colors);

    var legendOffset = -20;

    var legend = d3.legendColor()
        .shapeWidth(30)
        .cells(genre_selections.length)
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
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var overview = svg.append("g")
        .attr("class", "overview")
        .attr("transform", "translate(" + marginOverview.left + "," + marginOverview.top + ")");

    var gX = main.append("g")
        .attr("transform", "translate(0," + height + ")")
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

