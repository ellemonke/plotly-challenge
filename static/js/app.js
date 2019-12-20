
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

        // Fill in table with person's metadata
        data.metadata.forEach(person => {
            if (parseInt(person.id) === name) {
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
            if (parseInt(sample.id) === name) {

                // Set plot values
                var ids = sample.otu_ids;
                var values = sample.sample_values;
                var labels = sample.otu_labels;

                // Plot horizontal bar chart
                data = [{
                    y: ids,
                    x: values,
                    text: labels,
                    type: "bar", 
                    orientation: "h"
                }];
                Plotly.newPlot("bar", data);    

                // Plot bubble chart

            };   
        });
    });    
};

// Initial data on page
function init() {
    setOptions();
    plotCharts(940);
};

init();
  
// Update Plots when dropdown name changes
function updatePlotly() {
    // Fetch data
    d3.json("samples.json").then(data => {

        demoTable(name);

        // Select dropdown menu
        var dropdownMenu = d3.select("#selDataset");

        // Pass in the selected name
        var name = dropdownMenu.property("value");

        var ids = [];
        var values = [];
        var labels = [];

        switch(name) {
            case "941":

                // Check for specified name
                data.samples.forEach(sample => {
                    if (parseInt(sample.id) === 941) {

                        // Set plot values
                        ids = sample.otu_ids;
                        values = sample.sample_values;
                        labels = sample.otu_labels;   
                    };
                });
                break;
            // default:
            //     plotCharts(940);
            //     break;
        };

        // Re-graph the bar chart
        Plotly.restyle("bar", "y", [ids]);
        Plotly.restyle("bar", "x", [values]);
        Plotly.restyle("bar", "text", [labels]);
        
    });
};
    