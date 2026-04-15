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
Chart.register(window.ChartDataLabels);

function initMap(f_before, f_after, t_color, c_scale_type){
    // FIXED PATH: Relative path for GitHub Pages compatibility
    fetch('libs/states-10m.json')
        .then((r) => r.json())
        .then((us) => {

            const colorScaleConfig = c_scale_type == null ? {
                quantize: 10,
                type: 'colorLogarithmic',
            } : {};

            nation = ChartGeo.topojson.feature(us, us.objects.nation).features[0];
            statesMap = ChartGeo.topojson.feature(us, us.objects.states).features;

            if (chart) {
                chart.destroy();
                chart = null;
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
                                    const rawValue = map_data[context.raw.feature.properties.name];
                                    // ADDING COMMAS HERE
                                    const formattedValue = rawValue >= 0 ? rawValue.toLocaleString('en-US') : rawValue;
                                    return rawValue >= 0 ? context.raw.feature.properties.name + ": " + f_before + formattedValue + f_after : '';
                                }
                            }
                        },
                        datalabels: {
                            align: 'center',
                            color: t_color,
                            backgroundColor: null,
                            formatter: function (value) {
                                const stateName = value.feature.properties.name;
                                if (stateName === 'Virgin Islands' || stateName === 'Guam') {
                                    return '';
                                }
                                if (map_data[stateName] >= 0){
                                    // ADDING COMMAS HERE
                                    const formattedValue = map_data[stateName].toLocaleString('en-US');
                                    return f_before + formattedValue + f_after;
                                } else {
                                    return '';
                                };
                            },
                            font: { weight: 'normal', size: 11 }
                        },
                    },
                    scales: {
                        xy: { projection: 'albersUsa' },
                        color: colorScaleConfig
                    },
                }
            });
        })
        .catch(err => console.error("Map Error:", err));
};