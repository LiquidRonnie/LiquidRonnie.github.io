// Create horizontal bar chart function

function sampleCharts(sample) {
    // read sample.json file using d3.
    d3.json("samples.json").then((data) => {

        // Grab values from the data json object to build the plots
        var samples = data.samples;
        var resultArray = samples.filter(sample_value => sample_value.id == sample);
        var result = resultArray[0];
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        // Create trace variables for Horizontal Bar Chart
        var traceBar = {
            y:otu_ids.slice(0,10).map(otuID => `Otu ${otuID}`).reverse(),
            x:sample_values.slice(0,10).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type:"bar",
            orientation:"h"
        };

        // Create Data variavble to hold Trace
        var data = [traceBar];

        // Create layout
        var layout = {
            title:"top 10 Otus found on Indivduals",
            margin: { t: 30, l: 150 }
        };

        // display bar chart
        Plotly.newPlot("bar", data, layout);


        // Create Trace for Bubble Chart
        var TraceBubble = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                color: otu_ids,
                size: sample_values 
            }
        };

        // Create data vriable for bubble Tracer
        var bubbleData = [TraceBubble];

        // Create bubble chart layout
        var bubbleLayout = {
            xaxis: {title: "OTU ID"},
            hovermode: "closest",
            margins: {t:0}
        }

        // Display bubble chart
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    });
    
};

// Create function to build metadata
function metadata(sample) {
    // read sample.json file using d3.
    d3.json("samples.json").then((data) => {

        // Grab data
        var metadata = data.metadata;
        var metadataID = metadata.filter(sampleObjects => sampleObjects.id == sample);
        var results = metadataID[0]
        var panel = d3.select("#sample-metadata").html("");
        Object.entries(results).forEach(([key, value]) => {
            panel.append("h6").text(`${key}: ${value}`);
        });
    });
};
    
function init() {
    // Grab a reference to the dropdown select element
    // var selector = d3.select("#selDataset");
    
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var dropdownValue = data.names;
      var dropdown = d3.select("#selDataset");

      dropdownValue.forEach((sample) => {
        dropdown
          .append("option")
          .text(sample)
          .property("value", sample);
      });
    
      // Use the first sample from the list to build the initial plots
      var firstSample = dropdownValue[0];
      sampleCharts(firstSample);
      metadata(firstSample);
    });
    };
    
function optionChanged(newSample) {
// Fetch new data each time a new sample is selected
sampleCharts(newSample);
metadata(newSample);
};
    
// Initialize the dashboard
init();