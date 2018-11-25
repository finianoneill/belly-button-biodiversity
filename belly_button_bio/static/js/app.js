function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(metaData){

    console.log(metaData);
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(metaData).forEach((entry) => {
        const [key, value] = entry;
        panel
          .append("option")
          .text(`${key}: ${value}`)
          .property("value", key);
    });

    // BONUS: Build the Gauge Chart
    buildGauge(metaData.WFREQ);
  });
}

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(sampleData){
    // @TODO: Build a Bubble Chart using the sample data
    var bubbleLabels = sampleData["otu_ids"];
    // Build Bubble Chart
    var bubbleLayout = {
        margin: { t: 0 },
        hovermode: 'closest',
        xaxis: { title: 'OTU ID' }
    };
    var bubbleData = [{
        x: sampleData["otu_ids"],
        y: sampleData["sample_values"],
        text: bubbleLabels,
        mode: 'markers',
        marker: {
            size: sampleData["sample_values"],
            color: sampleData["otu_ids"],
            colorscale: "Earth",
        }
    }];
    var BUBBLE = document.getElementById('bubble');
    Plotly.newPlot(BUBBLE, bubbleData, bubbleLayout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pieData = [{
        values: sampleData["sample_values"].slice(0, 10),
        labels: sampleData["otu_ids"].slice(0, 10),
        hovertext: bubbleLabels.slice(0, 10),
        hoverinfo: "hovertext",
        type: "pie"
    }];
    var pieLayout = {
        margin: { t: 0, l: 0 }
    };
    var PIE = document.getElementById('pie');
    Plotly.newPlot(PIE, pieData, pieLayout);
  });    
};

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
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// BONUS GAUGE:
function buildGauge(wfreq) {

  // Calculate the gauge level
  var gaugeConversion = (wfreq / 9) * 180;

  // Trig to calc meter point
  var degrees = 180 - gaugeConversion,
       radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
       pathX = String(x),
       space = ' ',
       pathY = String(y),
       pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var gaugeData = [{ type: 'scatter',
     x: [0], y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'washes',
      text: wfreq,
      hoverinfo: 'text+name'},
    { values: [90/9, 90/9, 90/9, 90/9, 90/9, 90/9, 90/9, 90/9, 90/9, 90],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1'],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(14, 127, 0, .5)', 'rgba(14, 127, 0, .5)', 
                          'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                           'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                           'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                           'rgba(255, 255, 255, 0)']},
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1'],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var gaugeLayout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
    title: 'Belly Button Washing Frequency \n (1-9 Scrubs per Week)',
    height: 500,
    width: 500,
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]}
  };

  var GAUGE = document.getElementById('gauge');
  Plotly.newPlot(GAUGE, gaugeData, gaugeLayout);

}

// Initialize the dashboard
init();