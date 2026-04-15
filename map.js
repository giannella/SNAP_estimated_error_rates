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

Chart.register(window.ChartDataLabels);

function initMap(f_before, f_after, t_color, c_scale){
      // Relative path for GitHub Pages
      fetch('libs/states-10m.json').then((r) => r.json()).then((us) => {

        if (c_scale == null){
            c_scale = {
                quantize: 10,
                type: 'colorLogarithmic',
            }
        }else{
            c_scale = {}
        };

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
                    data: statesMap.map((d) => ({feature: d, value: map_data[d.properties.name]})),
                    borderWidth: 1,
                    borderColor: 'gray',
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const rawValue = map_data[context.raw.feature.properties.name];
                                // FORCE NUMBER AND ADD COMMAS
                                if (rawValue !== undefined && rawValue !== null) {
                                    const formattedValue = Number(rawValue).toLocaleString('en-US');
                                    return context.raw.feature.properties.name + ": " + f_before + formattedValue + f_after;
                                }
                                return '';
                            }
                        }
                    },
                    datalabels: {
                        align: 'center',
                        color: t_color,
                        backgroundColor: null,
                        formatter: function (value) {
                            const stateName = value.feature.properties.name;
                            const rawValue = map_data[stateName];
                            
                            if (stateName == 'Virgin Islands' || stateName == 'Guam'){
                                return '';
                            }
                            else if (rawValue !== undefined && rawValue !== null && rawValue >= 0){
                                // FORCE NUMBER AND ADD COMMAS
                                const formattedValue = Number(rawValue).toLocaleString('en-US');
                                return f_before + formattedValue + f_after;
                            }else{
                                return '';
                            };
                        },
                        font: {
                            weight: 'normal',
                            size: 13,
                        }
                    },
                },
                scales: {
                    xy: {
                        projection: 'albersUsa',
                    },
                    color: c_scale
                },
            }
        });
    });
};