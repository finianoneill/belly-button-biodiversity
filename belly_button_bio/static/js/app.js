function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(sample).then(function(data){
    // @TODO: Build a Bubble Chart using the sample data
    var sampleValues = data["sample_values"]
    var otuIDs = data["otu_ids"]
    var outLabels = data["otu_labels"]

    // Create the Traces
    var trace1 = {
      x: otuIDs,
      y: sampleValues,
      mode: "markers",
      type: "scatter",
      name: "sample_values",
      marker: {
        color: "#2077b4",
        symbol: "hexagram"
      }
    };

    // Define the plot layout
    var layout = {
      title: "Sample Values by OTU ID",
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" }
    };

    var data = [trace1];
    Plotly.newPlot("plot", data, layout);
  })

    

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    //buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  //buildMetadata(newSample);
}

// Initialize the dashboard
init();