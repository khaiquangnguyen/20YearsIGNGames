// Preparations varibles, constants and functions

// to convert date object
var dateParse = d3.timeParse("%Y");
const GENRES = ['Action', 'Adventure', 'Board', 'Card', 'Educational', 'Fighting', 'Hunting', 'Music', 'Party', 'Platformer', 'Puzzle', 'RPG', 'Racing', 'Shooter', 'Simulation', 'Sports', 'Strategy'];
const PLATFORMS = ['Dreamcast', 'Game Boy (Color, Advance)', 'GameCube', 'Mobile', 'Nintendo (DS, 3DS, DSi)', 'Nintendo 64', 'PC', 'PlayStation (1, 2 ,3, 4)', 'PlayStation (Portable, Vita)', 'Wii (U)', 'Xbox (360, One)', 'iPad'];
var genre_selections = GENRES;
var platform_selections = PLATFORMS;
const TRANSITION_DURTAION = 500;
var LOW_OPACITY = 0.2;
var HIGH_OPACITY = 1;

// Set up the dimensions of the file
// sizing information, including margins so there is space for labels, etc
var margin_scatter = { top: 20, right: 20, bottom: 100, left: 150 },
    width_scatter = 1000 - margin_scatter.left - margin_scatter.right,
    height_scatter = 500 - margin_scatter.top - margin_scatter.bottom;

var svg_scatter = d3.select("#scatter_plot")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1000 500")
    .classed("svg-content", true)

// sizing information, including margins so there is space for labels, etc
var margin_genre = { top: 20, right: 20, bottom: 100, left: 150 },
    width_genre = 500 - margin_genre.left - margin_genre.right,
    height_genre = 500 - margin_genre.top - margin_genre.bottom;
var svg_genre = d3.select("#genres_plot")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 500 500")
    .classed("svg-content", true)

// sizing information, including margins so there is space for labels, etc
var margin_platform = { top: 20, right: 20, bottom: 100, left: 150 },
    width_platform = 500 - margin_platform.left - margin_platform.right,
    height_platform = 500 - margin_platform.top - margin_platform.bottom;
var svg_platform = d3.select("#platforms_plot")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 500 500")
    .classed("svg-content", true)

// to aggregate all data points of the same release date
const aggregate = (fields, data, main_fields) => {
    // get only the data that we need
    var parsedData = data.map(function (d) {
        var dataObject = {
            date: d['release_year']
        };
        main_fields.forEach(function (s) {
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
// stack object for genre
const genre_stack = d3.stack()
    .keys(GENRES)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

// stack object for platform
const platform_stack = d3.stack()
    .keys(PLATFORMS)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

// generate the scatter array for the scatter plot
const generate_scatter_array = () => {
    var scatter_data = [];
    platform_selections.forEach(platform => {
        genre_selections.forEach(genre => {
            let object = {
                'platform': platform,
                'genre': genre,
                'count': 0
            }
            scatter_data.push(object);
        })
    });
    return scatter_data;
}

// get max of the stack
function stackMax(layer) {
    return d3.max(layer, function (d) { return d[1]; });
}

var genre_dict = {};
GENRES.forEach(genre => {
    genre_dict[genre] = true;
});

var platform_dict = {};
PLATFORMS.forEach(platform => {
    platform_dict[platform] = true;
});

// axes for the lots
var x_genres = d3.scaleTime().range([0, width_genre]),
    y_genres = d3.scaleLinear().range([height_genre, 0]),
    x_platforms = d3.scaleTime().range([0, width_platform]),
    y_platforms = d3.scaleLinear().range([height_platform, 0]),
    x_scatter = d3.scaleBand().rangeRound([0, width_scatter]).padding(0.1),
    y_scatter = d3.scaleBand().rangeRound([0, height_scatter]).padding(0.1);

var x_axis_genres = d3.axisBottom(x_genres),
    y_axis_genres = d3.axisLeft(y_genres),
    x_axis_platforms = d3.axisBottom(x_platforms),
    y_axis_platforms = d3.axisLeft(y_platforms),
    x_axis_scatter = d3.axisBottom(x_scatter),
    y_axis_scatter = d3.axisLeft(y_scatter);

var genres_colors = GENRES.map(function (d, i) {
    return d3.interpolateWarm(i / GENRES.length);
});

var genres_colors_scale = d3.scaleOrdinal()
    .domain(GENRES)
    .range(genres_colors);

var platform_colors = PLATFORMS.map(function (d, i) {
    return d3.interpolateWarm(i / PLATFORMS.length);
});

var platform_colors_scale = d3.scaleOrdinal()
    .domain(PLATFORMS)
    .range(platform_colors);

d3.queue()
    .defer(d3.csv, "pre_processed.csv")
    .defer(d3.csv, "games_2.csv")
    .await(function (error, scatter_data, data) {
        if (error) {
            console.error('Oh dear, something went wrong: ' + error);
            return;
        }
        // ---------------------------------------------
        // ------------   SCATTER PLOT -----------------
        // ---------------------------------------------

        var max_count = 0;
        // preprocessing the data to get the right data format
        var scatter_data_processed = generate_scatter_array();
        scatter_data.forEach(function (d) {
            d['release_year'] = dateParse(d['release_year']);
            const p_index = platform_selections.indexOf(d.platform);
            const g_index = genre_selections.indexOf(d.genre);
            if (p_index != -1 && g_index != -1) {
                const data_index = p_index * genre_selections.length + g_index;
                scatter_data_processed[data_index].count = scatter_data_processed[data_index].count + 1;
                max_count = Math.max(max_count, scatter_data_processed[data_index].count);
            }
        });

        // define the domain
        x_scatter.domain(scatter_data.map(function (d) { return d.genre; }));
        y_scatter.domain(scatter_data.map(function (d) { return d.platform; }));

        // create the main plot
        var scatter_plot = svg_scatter.append("g")
            .attr("class", "main")
            .attr("transform", "translate(" + margin_scatter.left + "," + margin_scatter.top + ")");
        // draw the axes
        scatter_plot.append("g")
            .attr("transform", "translate(-22," + height_scatter + ")")
            .attr("class", "axis axis--x")
            .call(x_axis_scatter)

        scatter_plot.append("g")
            .attr("class", "axis axis--y")
            .call(y_axis_scatter)

        scatter_plot.selectAll(".column")
            .data(scatter_data_processed)
            .enter().append("circle")
            .attr("class", "bar")
            .attr("cx", function (d) { return x_scatter(d.genre); })
            .attr("cy", function (d) { return y_scatter(d.platform); })
            .attr('r', function (d) { return d.count / max_count * 20; })
            .attr('opacity', function (d) {
                if (genre_selections.indexOf(d.genre) === -1 && platform_selections.indexOf(d.platform) === -1) {
                    return 0.1;
                }
                else {
                    return 1;
                }
            })
            .attr("width", x_scatter.bandwidth())
            .attr("height", function (d) { return height_scatter - y_scatter(d.frequency); });


        // ---------------------------------------------
        // ------------   GENRES PLOT- -----------------
        // ---------------------------------------------

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

        // ---------------------------------------------
        // ------------   GENRES PLOT- -----------------
        // ---------------------------------------------

        var genre_data = aggregate(genre_selections, data, GENRES);
        var genre_layers = genre_stack(genre_data);
        x_genres.domain([genre_data[0].date, genre_data[genre_data.length - 1].date]);
        y_genres.domain([0, d3.max(genre_layers, stackMax)]);

        var legendOffset = -20;

        var genre_legend = d3.legendColor()
            .shapeWidth(30)
            .cells(GENRES.length)
            .orient("vertical")
            .scale(genres_colors_scale)

        var area_genre = d3.area()
            .x(function (d, i) { return x_genres(d.data.date) })
            .y0(function (d) { return y_genres(d[0]); })
            .y1(function (d) { return y_genres(d[1]); })
            .curve(d3.curveMonotoneX);

        var genre_plot = svg_genre.append("g")
            .attr("class", "main")
            .attr("transform", "translate(" + margin_genre.left + "," + margin_genre.top + ")");

        genre_plot.append("g")
            .attr("transform", "translate(0," + height_genre + ")")
            .attr("class", "axis axis--x")
            .call(x_axis_genres)
            .select(".domain")
            .remove();

        genre_plot.append("g")
            .attr("class", "axis axis--y")
            .call(y_axis_genres);

        genre_plot.selectAll(".genre_path")
            .data(genre_layers)
            .enter().append("path")
            .attr("class", "genre_path")
            .attr("d", area_genre)
            .attr("fill", function (d, i) {
                return genres_colors[i];
            });

        var legendObject = genre_plot.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + legendOffset.toString() + ",0)");

        genre_plot.select(".legend")
            .call(genre_legend);

        var genre_graph_legend = legendObject.selectAll('rect').data(genres_colors);
        genre_graph_legend.on("click", function () {
            item = this.nextSibling.innerHTML;
            genre_dict[item] = !genre_dict[item];
            genre_selections = []
            Object.keys(genre_dict).forEach(genre => {
                if (genre_dict[genre] === true) {
                    genre_selections.push(genre);
                }
            });
            // recalculate the data
            genre_data = aggregate(genre_selections, data, GENRES);
            genre_layers = genre_stack(genre_data);
            y_genres.domain([0, d3.max(genre_layers, stackMax)]);
            genre_plot.selectAll(".genre_path")
                .data(genre_layers)
                .transition()
                .duration(TRANSITION_DURTAION)
                .attr("d", area_genre)
                .attr("fill", function (d, i) {
                    return genres_colors[i];
                });

            scatter_plot.selectAll("circle")
                .transition()
                .duration(TRANSITION_DURTAION)
                .attr('opacity', function (d) {
                    if (genre_selections.indexOf(d.genre) === -1 || platform_selections.indexOf(d.platform) === -1) {
                        return 0.1;
                    }
                    else {
                        return 1;
                    }
                })
        });

        // ---------------------------------------------
        // ------------   PLATFORMS PLOT- -----------------
        // ---------------------------------------------

        var platform_data = aggregate(platform_selections, data, PLATFORMS);
        var platform_layers = platform_stack(platform_data);
        x_platforms.domain([platform_data[0].date, platform_data[platform_data.length - 1].date]);
        y_platforms.domain([0, d3.max(platform_layers, stackMax)]);
        var legendOffset = -20;
        var platform_legend = d3.legendColor()
            .shapeWidth(30)
            .cells(PLATFORMS.length)
            .orient("vertical")
            .scale(platform_colors_scale)

        var area_platform = d3.area()
            .x(function (d, i) { return x_platforms(d.data.date) })
            .y0(function (d) { return y_platforms(d[0]); })
            .y1(function (d) { return y_platforms(d[1]); })
            .curve(d3.curveMonotoneX);

        var platform_plot = svg_platform.append("g")
            .attr("class", "main")
            .attr("transform", "translate(" + margin_genre.left + "," + margin_genre.top + ")");

        platform_plot.append("g")
            .attr("transform", "translate(0," + height_platform + ")")
            .attr("class", "axis axis--x")
            .call(x_axis_platforms)
            .select(".domain")
            .remove();

        platform_plot.append("g")
            .attr("class", "axis axis--y")
            .call(y_axis_platforms);
        console.log(platform_layers);
        platform_plot.selectAll(".platform_path")
            .data(platform_layers)
            .enter().append("path")
            .attr("class", "platform_path")
            .attr("d", area_platform)
            .attr("fill", function (d, i) {
                return platform_colors[i];
            });

        var legendObject = platform_plot.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + legendOffset.toString() + ",0)");

        platform_plot.select(".legend")
            .call(platform_legend);

        var platform_graph_legend = legendObject.selectAll('rect').data(platform_colors);
        platform_graph_legend.on("click", function () {
            item = this.nextSibling.innerHTML;
            platform_dict[item] = !platform_dict[item];
            platform_selections = []
            Object.keys(platform_dict).forEach(platform => {
                if (platform_dict[platform] === true) {
                    platform_selections.push(platform);
                }
            });
            // recalculate the data
            platform_data = aggregate(platform_selections, data, PLATFORMS);
            platform_layers = platform_stack(platform_data);
            y_platforms.domain([0, d3.max(platform_layers, stackMax)]);
            console.log(platform_plot.selectAll(".platform_path"));
            platform_plot.selectAll(".platform_path")
                .data(platform_layers)
                .transition()
                .duration(TRANSITION_DURTAION)
                .attr("d", area_platform)
                .attr("fill", function (d, i) {
                    return platform_colors[i];
                });
            scatter_plot.selectAll("circle")
                .transition()
                .duration(TRANSITION_DURTAION)
                .attr('opacity', function (d) {
                    if (genre_selections.indexOf(d.genre) === -1 || platform_selections.indexOf(d.platform) === -1) {
                        return 0.1;
                    }
                    else {
                        return 1;
                    }
                })
        });

    });