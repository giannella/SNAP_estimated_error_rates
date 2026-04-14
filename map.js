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
      // GENERATE MAP
      fetch('/libs/states-10m.json').then((r) => r.json()).then((us) => {

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
                            if (value.feature.properties.name == 'Virgin Islands'){
                                return '';
                            }
                            else if (value.feature.properties.name == 'Guam'){
                                return '';
                            }
                            else if (map_data[value.feature.properties.name] >= 0){
                                return f_before + map_data[value.feature.properties.name] + f_after;
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