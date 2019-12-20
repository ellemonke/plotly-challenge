
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
  
// Update Plots when dropdown name changes
function updatePlotly() {
    // Pass in the selected name
    var name = dropdownMenu.property("value");

    // Re-plot charts
    plotCharts(name);
};    

init();
