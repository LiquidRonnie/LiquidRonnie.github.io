// get URLS
var equakeURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

var tectonicURL = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json'

// Perform a GET request to the query URL
d3.json(equakeURL, function(data) {
    createFeatures(data.features);
})

// create data markers and tooltip
function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<b>Location: </b>" + feature.properties.place + "<br><b> Magnitude: </b>" + feature.properties.mag
            + "<hr>" + new Date(feature.properties.time));
        },
        pointToLayer: function(feature, latlng) {
            return new L.circle(latlng,
                {radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.properties.mag),
                fillOpacity: 100,
                color: "blue",
                stroke: true,
                weight: .8
            })
        }
    });

    createMap(earthquakes);
};

// create three map layers
function createMap(earthquakes) {

    var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
      });  

    var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Satellite": satelliteMap,
        "Light": lightMap,
        "Dark": darkMap
    };

    // create tectonic plate layer
    var tectonicplates = new L.layerGroup();

    // create overlay object to hold overlay layer
    var overlayMaps = {
        "earthquakes": earthquakes,
        "tectonic plates": tectonicplates
    };

    // create map and default settings
    var myMap = L.map("map", {
        center: [38, -104],
        zoom:4,
        layers: [satelliteMap, earthquakes, tectonicplates]
    });

    // add tectonic plate data
    d3.json(tectonicURL, function(tectonicData){
        L.geoJSON(tectonicData, {
            color:"Orange",
            weight: 2
        })
        .addTo(tectonicplates);
    });

    // Add layer contorl to map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Add legend
    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "info legend"),
        grades = [0,1,2,3,4,5],
        labels = [];

        // append legend labels
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += '<i style="background:' + getColor(grades[i] + 1) + '"></i>'
            + grades[i] + (grades[i + 1] ?'&ndash;' + grades[i+ 1] + '<br>': '+');
        }
        return div;
    };
    legend.addTo(myMap)
};

// assign colors
function getColor(magnitude) {
    if (magnitude > 5) {
        return "#F95F66"
    }
    else if (magnitude > 4) {
        return "#FBA35D"
    }
    else if (magnitude > 3) {
        return "#FBB72A"
    }
    else if (magnitude > 2) {
        return "#F7DB0F"
    }
    else if (magnitude > 1) {
        return "#DCF400"
    }
    else {
        return "#A3F601"
    }
};

// create radius size
function getRadius(magnitude) {
    return magnitude * 30000;
};