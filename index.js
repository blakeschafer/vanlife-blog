// Initialize the map and set its view to the US
var map = L.map('map').setView([37.0902, -95.7129], 4);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Create a custom icon
var customIcon = L.icon({
    iconUrl: 'https://codehs.com/uploads/8fe2e5fa9671b1888871781736f2b551', // Path to the custom marker image
    iconSize: [30, 50], // Adjusted size (smaller width and height)
    iconAnchor: [15, 50], // Adjusted anchor point to center the icon at its location
    popupAnchor: [0, -45] // Adjust the popup anchor to keep it above the icon
});


fetch('visits.json')
    .then(response => response.json())
    .then(locations => {
        const blogList = document.getElementById('blog-list');

        // Add markers and popups
        locations.forEach(function(location) {
            // Add markers to the map
            const marker = L.marker(location.coords, { icon: customIcon }).addTo(map);

            // Create the popup content for each marker
            let popupContent = `<b>${location.name.split(' - ')[0]}</b> <br><br>`;  // Only show city name
            if (location.image) {
                popupContent += `<img src="${location.image}" alt="${location.name}" style="width: 200px; height: auto; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);"><br><br>`;
            }
            popupContent += `<a href="${location.url}" target="_blank">View Post</a>`;
            marker.bindPopup(popupContent);

            // Add each blog post to the list under the map
            const listItem = document.createElement('li');
            listItem.classList.add('blog-item');
            listItem.innerHTML = `
                <a href="${location.url}" target="_blank">
                    ${location.name}  -  ${location.date}
                </a>
            `;
            blogList.appendChild(listItem);
        });

        // Create a polyline to connect the locations
        const routeCoordinates = locations.map(loc => loc.coords);
        const route = L.polyline(routeCoordinates, { color: '#3498db' }).addTo(map);
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