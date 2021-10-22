// from data.js
var tableData = data;

// Get a reference to the table body
  var tbody = d3.select("tbody");

// create function to import table from data.js

function createTable(data) {
    tbody.html("");
    data.forEach(tableRow => {
        // Append a tr to tbody
        var row = tbody.append("tr")
        // Loop through the object and then add each value to a td tag
        Object.values(tableRow).forEach(colValue => {
            row.append("td").text(colValue);
        });
    });
};

// diplay table
createTable(tableData)

// Create function to filter data
function submitHandler() {
    
    // Prevent the pagr from refreshing
    d3.event.preventDefault();

    // select input elemt and get raw html node
    var inputElement = d3.select("#datetime");

    // get input value property of the input element
    var inputValue = inputElement.property("value");

    var filteredData = tableData.filter(tableData => tableData.datetime === inputValue);

    // get filtered table
    createTable(filteredData);
};

d3.select("button").on("click", submitHandler);

d3.select("form").on("submit", submitHandler);

// // Create function to filter data
// function cityFilter() {
    
//     // Prevent the pagr from refreshing
//     d3.event.preventDefault();

//     // select input elemt and get raw html node
//     var inputElement = d3.select("#city");

//     // get input value property of the input element
//     var inputValue = inputElement.property("value");

//     var filteredData = tableData.filter(tableData => tableData.city === inputValue);

//     // get filtered table
//     createTable(filteredData);
// };

// // set up event listeners

// d3.select("#filter-btn").on("click", submitHandler);

// d3.select("form").on("submit", submitHandler);

// d3.select("#filter-btn").on("click", cityFilter);

// d3.select("form").on("submit", cityFilter);