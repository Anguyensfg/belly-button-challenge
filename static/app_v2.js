// Declare URL for data retrieval
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Set Variables
var data = {};

// Set Selectors
var inputSelector = d3.select("#selDataset");
var panelDemoInfo = d3.select("#sample-metadata");


function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

// Demographic Info panel
function populateDemoInfo(idNum) {
    console.log("Pop: " + idNum);

    // Filter out nominated ID 
    var metadataFilter = data.metadata.filter(item => item["id"] == idNum);
    console.log(`metaFilter length: ${metadataFilter.length}`);

    // Clear current display data 
    panelDemoInfo.html("");

    // Add back details
    Object.entries(metadataFilter[0]).forEach(([key, value]) => { var titleKey = titleCase(key); panelDemoInfo.append("h6").text(`${titleKey}: ${value}`) });
}

// Comparison function
function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            return 0;
        }
        const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];
        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (order === 'desc') ? (comparison * -1) : comparison
        );
    };
}

// Bar Plot
function drawBarPlot(idNum) {
    console.log("Bar: " + idNum);

    // Filter out nominated ID 
    var samplesFilter = data["samples"].filter(item => item["id"] == idNum);

    // Obtain data in array
    var sample_values = samplesFilter[0].sample_values;
    var otu_ids = samplesFilter[0].otu_ids;
    var otu_labels = samplesFilter[0].otu_labels;

    // Create an array of objects 
    var combinedList = [];
    for (var i=0; i < sample_values.length; i++) {
        var otu_id = otu_ids[i];
        var otu_text = "OTU " + otu_id.toString();
        var combinedObject = {"sample_values": sample_values[i], "otu_ids": otu_text, "otu_labels": otu_labels[i]};
        combinedList.push(combinedObject);
    }

    // Sort and slice Array
    var sortedList = combinedList.sort(compareValues("sample_values", "desc"));
    var slicedList = sortedList.slice(0, 10);

    // Grab the text into arrays with map now
    var sample_values_list = slicedList.map(item => item.sample_values).reverse();
    var otu_ids_list = slicedList.map(item => item.otu_ids).reverse();
    var otu_labels_list = slicedList.map(item => item.otu_labels).reverse();
  

    // Trace Data Variable
    var trace = {
        type: "bar",
        y: otu_ids_list,
        x: sample_values_list,
        text: otu_labels_list,
        orientation: 'h'
    };

        // Define the layout
        var layout = {
            title: "Top 10 OTUs Found",
            yaxis: { title: "OTU Labels" },
            xaxis: { title: "Values"}
        };

    // Data
    var traceData = [trace];

    Plotly.newPlot("bar", traceData, layout);
}

// Bubble Chart
function drawBubbleChart(idNum) {
    console.log("Bubble: " + idNum);

    // Filter out nominated ID 
    var samplesFilter = data["samples"].filter(item => item["id"] == idNum);

    // Trace Data Variable
    var trace = {
        x: samplesFilter[0].otu_ids,
        y: samplesFilter[0].sample_values,
        mode: 'markers',
        text: samplesFilter[0].otu_labels,
        marker: {
                    color: samplesFilter[0].otu_ids,
                    size: samplesFilter[0].sample_values,
                    colorscale: "Earth"
        }
    };

    // Data
    var traceData = [trace];

    // Define the layout
    var layout = {
                    showlegend: false,
                    height: 600,
                    width: 1500,
                    xaxis: { title: "OTU ID"}
    };

    Plotly.newPlot('bubble', traceData, layout);
}

// Gauge Chart
function drawGaugeChart(idNum) {
    console.log("Gauge: " + idNum);

    // Filter out nominated ID 
    var metadataFilter = data.metadata.filter(item => item["id"] == idNum);
    var level = metadataFilter[0].wfreq;
    var offset = [ 0, 0, 3, 3, 1, -0.5, -2, -3, 0, 0];

    // Parameters for Gauge Chart
    var degrees = 180 - (level * 20 + offset[level]);
    var height = .6;
    var widthby2 = .05;
    var radians = degrees * Math.PI / 180;
    var radiansBaseL = (90 + degrees) * Math.PI / 180;
    var radiansBaseR = (degrees - 90) * Math.PI / 180;
    var xHead = height * Math.cos(radians);
    var yHead = height * Math.sin(radians);
    var xTail0 = widthby2 * Math.cos(radiansBaseL);
    var yTail0 = widthby2 * Math.sin(radiansBaseL);
    var xTail1 = widthby2 * Math.cos(radiansBaseR);
    var yTail1 = widthby2 * Math.sin(radiansBaseR);

    // Pointer for Gauge Chart
    var triangle = `M ${xTail0} ${yTail0} L ${xTail1} ${yTail1} L ${xHead} ${yHead} Z`;

    // Trace Data Variable
    var traceData = [{
                        type: 'scatter',
                        x: [0],
                        y: [0],
                        marker: {size: 25, color: '#85000'},
                        showlegend: false,
                        name: 'frequency',
                        text: level,
                        hoverinfo: 'text+name'},
                    {   values: [180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180],
                        rotation: 90,
                        text: ['8-9','7-8','6-7','5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
                        textinfo: 'text',
                        textposition: 'inside',
                        marker: {colors: [  '#84B589', '#89BB8F', '#8CBF88', '#B7CC92', '#D5E49D',
                                            '#E5E7B3', '#E9E6CA', '#F4F1E5', '#F8F3EC', '#FFFFFF',]},
                        labels: ['8-9','7-8','6-7','5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
                        hoverinfo: 'label',
                        hole: .5,
                        type: 'pie',
                        showlegend: false
    }];

    // Set layout for website
    var layout = {
                    shapes:[{ type: 'path', path: triangle, fillcolor: '#85000', line: { color: '#85000' } }],
                    title: '<b>Belly Button Wash Frequency</b><br>Scrubs per Week',
                    xaxis: {zeroline: false, showticklabels: false, showgrid: false, range: [-1, 1]},
                    yaxis: {zeroline: false, showticklabels: false, showgrid: false, range: [-1, 1]}
    };
    Plotly.newPlot('gauge', traceData, layout);
}

// Initialization: 
function initialization () {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(jsonData) {
        console.log("Gathering Data");
        data = jsonData;
        console.log("Keys: " + Object.keys(data));
        names = data.names;

        // Test Subject Filter
        names.forEach(element => { inputSelector.append("option").text(element).property("value", element); });

        // Demographic info table
        var idNum = names[0];
        populateDemoInfo(idNum);

        // Bar Plot
        drawBarPlot(idNum);

        // Bubble Chart
        drawBubbleChart(idNum);

        // Gauge Chart
        drawGaugeChart(idNum);
    });
}

initialization();

function optionChanged(idNum) {
    // Demographic Info Panel
    populateDemoInfo(idNum);

    // Bar Plot
    drawBarPlot(idNum);

    // Bubble Chart
    drawBubbleChart(idNum);

    // Gauge Chart
    drawGaugeChart(idNum);
};