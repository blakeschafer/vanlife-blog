// Initialize the map and set its view to the US
var map = L.map('map').setView([37.0902, -95.7129], 4);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Create a custom icon
var customIcon = L.icon({
    iconUrl: 'https://codehs.com/uploads/8fe2e5fa9671b1888871781736f2b551', // Path to the custom marker image
    iconSize: [30, 50], // Adjusted size (smaller width and height)
    iconAnchor: [15, 50], // Adjusted anchor point to center the icon at its location
    popupAnchor: [0, -45] // Adjust the popup anchor to keep it above the icon
});

// Variables to count the number of each gradband
var counts = {
    'High School': 0,
    'Middle School': 0,
    'Elementary School': 0,
    'K-12': 0,
    'Van Route': 0,
    'Total': 0
};

// Fetch the van visits locations from visits.json
fetch('visits.JSON')
    .then(response => response.json())
    .then(locations => {
        // Add markers and popups
        locations.forEach(function(location) {
            var marker = L.marker(location.coords, { icon: customIcon }).addTo(map);

            counts['Van Route']++;

            var popupContent = `<b>${location.name}</b> <br><br>`;

            // Include image if available
            if (location.image) {
                popupContent += `<img src="${location.image}" alt="${location.name}" style="width: 200px; height: auto; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);"><br><br>`;
            }

            popupContent += `<a href="${location.url}" target="_blank">View Post</a>`;

            marker.bindPopup(popupContent);
        });

        // Create a polyline to connect the locations
        var routeCoordinates = locations.map(loc => loc.coords);
        var route = L.polyline(routeCoordinates, { color: 'hotpink' }).addTo(map);
    })
    .catch(error => console.error('Error fetching visits.json:', error));


// Function to convert DMS to decimal degrees
function dmsToDecimal(dmsStr) {
    var dmsPattern = /(\d+)[^\d]+(\d+)[^\d]+([\d\.]+)[^\d]*([NSEW])/i;
    var result = dmsStr.match(dmsPattern);
    if (!result) {
        console.error('Invalid DMS string: ' + dmsStr);
        return null;
    }

    var degrees = parseFloat(result[1]);
    var minutes = parseFloat(result[2]);
    var seconds = parseFloat(result[3]);
    var direction = result[4].toUpperCase();

    var decimal = degrees + minutes / 60 + seconds / 3600;

    if (direction == 'S' || direction == 'W') {
        decimal = -decimal;
    }

    return decimal;
}

// default icons for different gradbands
var iconOptions = {
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
};

// Create icons for different gradbands
var blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [13, 21],       // Even smaller size
    iconAnchor: [6, 21],      // Adjusted anchor point
    popupAnchor: [1, -17],    // Adjusted popup anchor
    shadowSize: [21, 21]      // Adjusted shadow size
});

var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [13, 21],       // Even smaller size
    iconAnchor: [6, 21],      // Adjusted anchor point
    popupAnchor: [1, -17],    // Adjusted popup anchor
    shadowSize: [21, 21]      // Adjusted shadow size
});

var yellowIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [13, 21],       // Even smaller size
    iconAnchor: [6, 21],      // Adjusted anchor point
    popupAnchor: [1, -17],    // Adjusted popup anchor
    shadowSize: [21, 21]      // Adjusted shadow size
});

var grayIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [13, 21],       // Even smaller size
    iconAnchor: [6, 21],      // Adjusted anchor point
    popupAnchor: [1, -17],    // Adjusted popup anchor
    shadowSize: [21, 21]      // Adjusted shadow size
});


// Fetch the locations from requests.JSON and add markers
fetch('requests.JSON')
    .then(response => response.json())
    .then(data => {
        data.forEach(function(location) {
            var latDMS = location.latitude;
            var lonDMS = location.longitude;

            // Check if latitude or longitude is N/A
            if(latDMS === "N/A" || lonDMS === "N/A") {
                return; // Skip this location
            }

            var lat = dmsToDecimal(latDMS);
            var lon = dmsToDecimal(lonDMS);

            if(lat === null || lon === null) {
                return; // Skip if conversion failed
            }

            // Extract city and state from the address
            var addressParts = location.address.split(',');
            var city = addressParts[addressParts.length - 2] ? addressParts[addressParts.length - 2].trim() : '';
            var state = addressParts[addressParts.length - 1] ? addressParts[addressParts.length - 1].trim() : '';

            var schoolName = location["school name"] || 'Unknown School';
            var gradband = location.gradband || 'Unknown';

            // Choose icon based on gradband and count the number
            var icon;
            if (gradband.includes('High School')) {
                icon = blueIcon;
                counts['High School']++;
            } else if (gradband.includes('Middle School')) {
                icon = greenIcon;
                counts['Middle School']++;
            } else if (gradband.includes('Elementary School')) {
                icon = yellowIcon;
                counts['Elementary School']++;
            } else {
                icon = grayIcon; // Default icon for other gradbands
                counts['K-12']++;
            }

            counts['Total']++;

            var marker = L.marker([lat, lon], {icon: icon, opacity: 0.7}).addTo(map);
            marker.bindPopup(`<b>${schoolName}</b><br>${city}, ${state}`);
        });

        // After all markers are added, create the legend
        createLegend();
    })
    .catch(error => console.error(error));

// Function to create the collapsible legend
function createLegend() {
    var legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'legend');

        // Create the heading
        var heading = L.DomUtil.create('h4', '', div);
        heading.style.cursor = 'pointer';
        heading.style.margin = '0';

        // Create the toggle indicator
        var indicator = L.DomUtil.create('span', '', heading);
        indicator.id = 'legend-toggle-indicator';
        indicator.textContent = '▼';

        // Add the text 'Legend' to the heading
        heading.appendChild(document.createTextNode(' Key '));

        // Attach the click event to the heading
        L.DomEvent.on(heading, 'click', toggleLegendContent);

        // Create the legend content container
        var contentDiv = L.DomUtil.create('div', '', div);
        contentDiv.id = 'legend-content';

        // High School
        var hsDiv = L.DomUtil.create('div', '', contentDiv);
        hsDiv.innerHTML = '<img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png" class="legend-icon"> High School (' + counts['High School'] + ')';

        // Middle School
        var msDiv = L.DomUtil.create('div', '', contentDiv);
        msDiv.innerHTML = '<img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" class="legend-icon"> Middle School (' + counts['Middle School'] + ')';

        // Elementary School
        var esDiv = L.DomUtil.create('div', '', contentDiv);
        esDiv.innerHTML = '<img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png" class="legend-icon"> Elementary School (' + counts['Elementary School'] + ')';

        // Other
        var otherDiv = L.DomUtil.create('div', '', contentDiv);
        otherDiv.innerHTML = '<img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png" class="legend-icon"> K-12 (' + counts['K-12'] + ')';

        // Van Route (Custom Pink Marker)
        var vanDiv = L.DomUtil.create('div', '', contentDiv);
        vanDiv.innerHTML = '<img src="https://codehs.com/uploads/8fe2e5fa9671b1888871781736f2b551" style="vertical-align: middle; width: 24px; height: 34px; margin-right: 4px;">Van Visits Route (' + counts['Van Route'] + ')';

        // Total Markers
        var totalDiv = L.DomUtil.create('div', '', contentDiv);
        totalDiv.style.marginTop = '5px';
        totalDiv.innerHTML = 'Total Schools: ' + counts['Total'];


        return div;
    };

    legend.addTo(map);
}

// Function to toggle the legend content
function toggleLegendContent() {
    var content = document.getElementById('legend-content');
    var indicator = document.getElementById('legend-toggle-indicator');
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        indicator.textContent = '▼'; // Down arrow when expanded
    } else {
        content.style.display = 'none';
        indicator.textContent = '▲'; // Up arrow when collapsed
    }
}
