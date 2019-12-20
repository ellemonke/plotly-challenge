// Set up the dropdown menu
function setOptions() {
    // Fetch data
    d3.json("samples.json").then(data => {

        // Select dropdown menu element
        var dropdownMenu = d3.select("#selDataset").on("change", updatePlotly);
        // Append test subject names
        data.names.forEach(name => {
            var option = dropdownMenu.append("option")
                .attr("value", name).text(name);
        });
    });
};


// Fetch samples per name
function plotCharts(name) {
    demoTable(name);

    d3.json("samples.json").then(data => {

        // Check for specified name
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


// Complete the demographic table
function demoTable(name) {
    d3.json("samples.json").then(data => {
        var demographics = d3.select("#sample-metadata");

        var meta = data.metadata;

        meta.forEach(person => {
            if (parseInt(person.id) === name) {
                demographics.append("p").html(`
                    AGE: ${person.age}<br>
                    BBTYPE: ${person.bbtype}<br>
                    ETHNICITY: ${person.ethnicity}<br>
                    GENDER: ${person.gender}<br>
                    LOCATION: ${person.location}<br>
                    WFREQ: ${person.wfreq}<br>
                    sample: ${person.id}
                `);
            };
        });

        

    });
};


// Initial data
function init() {
    setOptions();
    plotCharts(940);
};
  
init();
  

function updatePlotly() {
    d3.json("samples.json").then(data => {
        // Select dropdown menu element
        var dropdownMenu = d3.select("#selDataset").on("change", updatePlotly);

        // Pass in the selected name
        var name = dropdownMenu.property("value");

        // Check for specified name
        data.samples.forEach(sample => {
            if (parseInt(sample.id) === name) {

                // Set plot values
                var ids = sample.otu_ids;
                var values = sample.sample_values;
                var labels = sample.otu_labels;
              
                // Re-graph the bar chart
                Plotly.restyle("bar", "y", [values]);
                Plotly.restyle("bar", "x", [ids]);
                Plotly.restyle("bar", "text", [labels]);
            
            };
        });
    });
};
    