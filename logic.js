var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"

function markerSize(magnitude) {
    return magnitude * 3;
};

var earthquakes = new L.LayerGroup();

d3.json(queryUrl, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.8,
                weight: 0.5,
                color: "black"
            }
        },
        
        onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "<br> Magnitude: " + feature.properties.mag +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});

function Color(magnitude) {
    if (magnitude >= 5.5) {
        return 'black'
    } else if (magnitude > 5.3) {
        return 'red'
    } else if (magnitude > 5.1) {
        return 'orange'
    } else if (magnitude > 4.9) {
        return 'yellow'
    } else if (magnitude > 4.7) {
        return 'green'
    } else {
        return 'lightgreen'
    }
};

function createMap(earthquakes) {

    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });
      
    var baseMaps = {
        "Street Map": streetmap,
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [16.97, -7.99],
        zoom: 1.5,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
      
    var legend = L.control({position: "bottomleft"});
        
        legend.onAdd = function (map) {
        
        var div = L.DomUtil.create('div', 'info legend');
        magnitude = ["4.5", "4.7", "4.9", "5.1", "5.3", "5.5"];
        labels = [];

        div.innerHTML='<div><b>Magnitude</b></div';

        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }
        return div;
    };
        
    legend.addTo(myMap);
}

function getColor(d) {
    return d >= 5.5 ? 'black' :
           d > 5.3  ? 'red' :
           d > 5.1  ? 'orange' :
           d > 4.9  ? 'yellow' :
           d > 4.7   ? 'green' :
           d > 4.5  ? 'lightgreen' :
                        'white' ;
}