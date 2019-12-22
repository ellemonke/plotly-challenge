// Select dropdown menu
var dropdownMenu = d3.select("#selDataset");
dropdownMenu.on("change", updatePlotly);

// 1. Set up the dropdown menu
function setOptions() {

    // Fetch data
    d3.json("samples.json").then(data => {

        // Append each persons' id name
        data.names.forEach(name => {
            var option = dropdownMenu.append("option")
                .attr("value", name).text(name);
        });
    });
};

// 2. Complete the demographic table
function demoTable(name) {

    // Fetch data
    d3.json("samples.json").then(data => {

        // Select output table
        var demographics = d3.select("#sample-metadata");

        // Clear previous output
        demographics.html("");

        // Fill in table with person's metadata
        data.metadata.forEach(person => {
            if (parseInt(person.id) === parseInt(name)) {
                demographics.append("p").html(`
                    id: ${person.id}<br>
                    age: ${person.age}<br>
                    gender: ${person.gender}<br>
                    ethnicity: ${person.ethnicity}<br>
                    location: ${person.location}<br>
                    bbtype: ${person.bbtype}<br>
                    wfreq: ${person.wfreq}<br>
                `);
            };
        });
    });
};

// 3. Fetch samples per name
function plotCharts(name) {

    // First complete the demographic table 
    demoTable(name);

    // Fetch data
    d3.json("samples.json").then(data => {

        // Check for specified person in samples
        data.samples.forEach(sample => {
            if (parseInt(sample.id) === parseInt(name)) {
                
                // BAR CHART
                var topIds = sample.otu_ids.slice(0,10);
                var topValues = sample.sample_values.slice(0,10);
                var topLabels = sample.otu_labels.slice(0,10);

                var topIdsStr = topIds.map(id => `OTU ${id}`);

                var barData = [{
                    y: topIdsStr,
                    x: topValues,
                    text: topLabels,
                    type: "bar", 
                    orientation: "h",
                    transforms: [{
                        type: 'sort',
                        target: 'y',
                        order: 'descending'
                    }]
                }];

                var barLayout = {
                    height: 380,
                    margin: { t: 50, b: 20 }
                }

                Plotly.newPlot("bar", barData, barLayout);    

                // BUBBLE CHART
                var ids = sample.otu_ids;
                var values = sample.sample_values;
                var labels = sample.otu_labels;

                var bubbleData = [{
                    x: ids,
                    y: values,
                    text: labels, 
                    mode: "markers",
                    marker: {
                        color: ids,
                        size: values,
                        colorscale: "Earth"
                    }
                }];

                var bubbleLayout = {
                    xaxis: {title: "OTU ID"},
                    hovermode: "closest", 
                    margin: { t: 80 }
                };

                Plotly.newPlot("bubble", bubbleData, bubbleLayout);                
            };   
        });

        // GAUGE CHART
        data.metadata.forEach(person => {
            if (parseInt(person.id) === parseInt(name)) {
                var gaugeData = [{
                    domain: { x: [0, 9], y: [0, 9] },
                    value: person.wfreq,
                    title: { text: "Scrubs Per Week", font: { size: 18 } },
                    type: "indicator",
                    mode: "gauge+number",
                    gauge: {
                        axis: { 
                            range: [null, 9], 
                            tickmode: "linear", 
                            ticks: ""
                        },
                        steps: [
                            { range: [0, 1], color: "rgb(247, 242, 235)" },
                            { range: [1, 2], color: "rgb(236, 245, 227)" },
                            { range: [2, 3], color: "rgb(225, 247, 209)" },
                            { range: [3, 4], color: "rgb(214, 250, 181)" },
                            { range: [4, 5], color: "rgb(204, 255, 153)" },
                            { range: [5, 6], color: "rgb(189, 238, 150)" },
                            { range: [6, 7], color: "rgb(174, 222, 148)" },
                            { range: [7, 8], color: "rgb(158, 205, 146)" },
                            { range: [8, 9], color: "rgb(143, 188, 143)" }
                        ],
                        borderwidth: 0
                    },
                    number: { font: { size: 38 } }
                }];
                
                var gaugeLayout = {
                    width: 450,
                    height: 300,
                    align: "auto",
                    margin: { t: 50, b: 0 }
                };

                Plotly.newPlot('gauge', gaugeData, gaugeLayout);
            };
        });
    });    
};

// Initial data on page
function init() {
    setOptions();
    plotCharts(940);
};
  
// Update Plots when dropdown name changes
function updatePlotly() {
    // Pass in the selected name
    var name = dropdownMenu.property("value");

    // Re-plot charts
    plotCharts(name);
};    

init();
