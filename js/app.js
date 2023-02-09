// use D3 library to read in samples.json from URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


// Initialise web page

function innit() {

// Use D3 to select the dropdown menu
let selector = d3.select("#selDataset");

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);

    // adding subject id's to dropdown menu

    let sampleNames = data.names;
    console.log(sampleNames);

    for (let i = 0; i < sampleNames.length; i++) {
      const element = sampleNames[i];

      selector
        .append("option")
        .property("value", sampleNames[i])
        .text(sampleNames[i])  
    }

    // Set the first id 
    let sampleOne = sampleNames[0];

    console.log(sampleOne);

    // create initial plots
    charts(sampleOne);
    Metadata(sampleOne);
    

  });

};

// Function to create the charts
function charts(sample) {

  // Use D3 to retrieve all of the data
  d3.json(url).then((data) => {

      // Retrieve all sample data
      let sampleData = data.samples;

      // Filter based on the value of the sample
      let value = sampleData.filter(result => result.id == sample);

      // Get the first index from the array
      let valueData = value[0];

      // Get the otu_ids, lables, and sample values
      let otu_ids = valueData.otu_ids;
      let otu_labels = valueData.otu_labels;
      let sample_values = valueData.sample_values;

      // Log the data to the console
      console.log(otu_ids,otu_labels,sample_values);

      // Display top 10 items in descending order
      let yaxis = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
      let xaxis = sample_values.slice(0,10).reverse();
      let labels = otu_labels.slice(0,10).reverse();
      
      // Set up the trace for the bar chart
      let trace1 = {
          x: xaxis,
          y: yaxis,
          text: labels,
          type: "bar",
          orientation: "h"
      };

      // Setup the layout
      let layout = {
          title: "Top 10 OTUs Present"
      };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace1], layout)
      

      // Set up the trace for bubble chart
      let trace2 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
        }
    };

    // Set up the layout for the bubble chart
    let layout2 = {
      title: "Bacteria Per Sample",
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
  };

    // Call Plotly to plot the bubble chart
    Plotly.newPlot("bubble", [trace2], layout2)
});

};


// Function that populates metadata info
function Metadata(sample) {

  // Use D3 to retrieve all of the data
  d3.json(url).then((data) => {

      // Retrieve all metadata
      let metadata = data.metadata;

      // Filter based on the value of the sample
      let value = metadata.filter(result => result.id == sample);

      // Log the array of metadata objects after the have been filtered
      console.log(value)

      // Get the first index from the array
      let valueData = value[0];

      // Clear out metadata
      d3.select("#sample-metadata").html("");

      // Use Object.entries to add each key/value pair to the panel
      Object.entries(valueData).forEach(([key,value]) => {

          // Log the individual key/value pairs as they are being appended to the metadata panel
          console.log(key,value);

          d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
      });
  });

};

// Function that updates dashboard when sample is changed
function optionChanged(value) { 

  // Log the new value
  console.log(value); 

  // Call all functions 
  charts(value);
  Metadata(value);
};

innit();
