var map_data = [];
var map_dataH = [];
var map_dataB = [];
var map_data1 = [];
var map_data2 = [];
var map_data3 = [];

var map_data11 = [];
var map_data21 = [];
var map_data31 = [];

var map_data41 = [];
var map_data42 = [];
var map_data43 = [];
var map_data44 = [];
var map_data45 = [];

var chart;
var statesMap;
var nation;

// Register the data labels plugin
Chart.register(ChartDataLabels);

function initMap(f_before, f_after, t_color, c_scale_type){
    // 1. FIXED PATH: Removed leading slash for GitHub Pages compatibility
    fetch('libs/states-10m.json')
        .then((r) => {
            if (!r.ok) throw new Error("Could not load map data");
            return r.json();
        })
        .then((us) => {
            // 2. FIXED SCALE LOGIC: Ensure the scale type is correctly assigned
            const colorScaleConfig = {
                type: c_scale_type || 'colorLogarithmic',
                quantize: 10
            };

            // Parse TopoJSON into features for Chart.js
            nation = ChartGeo.topojson.feature(us, us.objects.nation).features[0];
            statesMap = ChartGeo.topojson.feature(us, us.objects.states).features;

            // Destroy existing chart instance if it exists to prevent memory leaks
            if (chart) {
                chart.destroy();
            }
            
            chart = new Chart(document.getElementById("canvas").getContext("2d"), {
                type: 'choropleth',
                data: {
                    labels: statesMap.map((d) => d.properties.name),
                    datasets: [{
                        label: 'States',
                        outline: nation,
                        data: statesMap.map((d) => ({
                            feature: d, 
                            value: map_data[d.properties.name]
                        })),
                        borderWidth: 1,
                        borderColor: 'gray',
                    }]
                },
                options: {
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const value = map_data[context.raw.feature.properties.name];
                                    return value >= 0 ? context.raw.feature.properties.name + ": " + f_before + value + f_after : '';
                                }
                            }
                        },
                        datalabels: {
                            align: 'center',
                            color: t_color,
                            backgroundColor: null,
                            formatter: function (value) {
                                const stateName = value.feature.properties.name;
                                // Hide labels for small territories where text doesn't fit
                                if (stateName === 'Virgin Islands' || stateName === 'Guam') {
                                    return '';
                                }
                                if (map_data[stateName] >= 0) {
                                    return f_before + map_data[stateName] + f_after;
                                }
                                return '';
                            },
                            font: { weight: 'normal', size: 11 }
                        },
                    },
                    scales: {
                        xy: { projection: 'albersUsa' },
                        color: colorScaleConfig // Using the fixed scale config
                    },
                }
            });
        })
        .catch(err => console.error("Map Error:", err));
};