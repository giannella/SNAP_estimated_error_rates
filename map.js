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

function initMap(f_before, f_after, t_color, c_scale_input){
    fetch('libs/states-10m.json').then((r) => r.json()).then((us) => {

        // SCALE CONFIGURATION
        // IMPORTANT: Do NOT set 'type' on the color scale.
        // chartjs-chart-geo auto-detects the scale type from the 'color' key name.
        // Setting type: 'colorLinear' or 'colorLogarithmic' replaces the registered
        // scale with an unknown string, silently breaking the map entirely.
        // min/max are inherited from Chart.js LinearScale and work correctly here.
        let scaleConfig = {
            axis: 'x',
            interpolate: 'blues'
        };

        if (c_scale_input && typeof c_scale_input === 'object') {
            // Strip 'type' from any passed object to avoid breaking the scale
            const { type, ...rest } = c_scale_input;
            Object.assign(scaleConfig, rest);
        }
        // String inputs (e.g. 'colorLogarithmic') are intentionally ignored —
        // the scale auto-detects as linear, which is safe for all current maps.

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
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const rawValue = map_data[context.raw.feature.properties.name];
                                if (rawValue !== undefined && rawValue !== null) {
                                    return context.raw.feature.properties.name + ": " + f_before + Number(rawValue).toLocaleString('en-US') + f_after;
                                }
                                return '';
                            }
                        }
                    },
                    datalabels: {
                        align: 'center',
                        color: t_color,
                        formatter: function (value) {
                            const stateName = value.feature.properties.name;
                            const rawVal = map_data[stateName];
                            if (stateName == 'Virgin Islands' || stateName == 'Guam') return '';
                            if (rawVal !== undefined && rawVal !== null && rawVal >= 0) {
                                return f_before + Number(rawVal).toLocaleString('en-US') + f_after;
                            }
                            return '';
                        },
                        font: { weight: 'normal', size: 13 }
                    },
                },
                scales: {
                    xy: { projection: 'albersUsa' },
                    color: scaleConfig
                },
            }
        });
    }).catch(err => console.error("Map Load Error:", err));
};