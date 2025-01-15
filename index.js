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
        const blogContainer = document.getElementById('blog-cards'); // Select the blog cards container

        locations.forEach(location => {
            // Add markers to the map
            const marker = L.marker(location.coords, { icon: customIcon }).addTo(map);

            // Create the popup content for each marker
            let popupContent = `<b>${location.name.split(' - ')[0]}</b> <br><br>`;  // Only show city name
            if (location.image) {
                popupContent += `<img src="${location.image}" alt="${location.name}" style="width: 200px; height: auto; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);"><br><br>`;
            }
            popupContent += `<a href="${location.url}" target="_blank">View Post</a>`;
            marker.bindPopup(popupContent);

            // Create the blog card
            const card = document.createElement('div');
            card.classList.add('blog-card');

            // Add the image
            const img = document.createElement('img');
            img.src = location.image;
            img.alt = `${location.name}`;
            img.style.width = '100%'; // Ensure the image fits the card width
            img.style.height = '150px'; // Fixed height for uniformity
            img.style.objectFit = 'cover'; // Crop image without distortion

            // Add the card content
            const content = document.createElement('div');
            content.classList.add('card-content');

            const title = document.createElement('h3');
            title.textContent = location.name;

            const date = document.createElement('p');
            date.textContent = location.date;

            // Add a link to the full blog post
            const link = document.createElement('a');
            link.href = location.url;
            link.target = '_blank';
            link.textContent = 'Read More';
            
            // Style the link as a button that covers the entire bottom of the card
            link.style.display = 'block'; // Make the link behave like a block element
            link.style.backgroundColor = '#007BFF'; // Button background color
            link.style.color = '#FFFFFF'; // Text color
            link.style.textDecoration = 'none'; // Remove underline
            link.style.fontWeight = 'bold'; // Bold text
            link.style.textAlign = 'center'; // Center-align text
            link.style.padding = '7px 0'; // Padding for the button
            link.style.borderRadius = '0 0 8px 8px'; // Rounded corners at the bottom
            link.style.width = '100%'; // Ensure it spans the full width of the card
            link.style.marginTop = '0px'; // Space between content and button
            
            // Add hover effect for the button
            link.style.transition = 'background-color 0.3s ease';
            link.addEventListener('mouseover', () => {
                link.style.backgroundColor = '#0056b3'; // Darker color on hover
            });
            link.addEventListener('mouseout', () => {
                link.style.backgroundColor = '#3498db'; // Original color
            });

            // Append content to the card
            content.appendChild(title);
            content.appendChild(date);
            card.appendChild(img);
            card.appendChild(content);
            card.appendChild(link);

            // Append card to the container
            blogContainer.appendChild(card);

            // Create a polyline to connect the locations
            const routeCoordinates = locations.map(loc => loc.coords);
            const route = L.polyline(routeCoordinates, { color: '#3498db', weight: 7.5 }).addTo(map);
        });
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