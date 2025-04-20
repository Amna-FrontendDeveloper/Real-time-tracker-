// socket setup
const socket = io();

console.log('hey');

// Check if the browser supports geolocation
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit('send-location', { latitude, longitude });
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}

// Initialize the map centered at (0, 0) with zoom level 10
const map = L.map("map").setView([0, 0], 10);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© Amna Mushtaq'
}).addTo(map);

// Create an empty object to store markers
const markers = {};

// Listen for incoming location data
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    if (markers[id]) {
        // If marker already exists, update its position
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // If marker doesn't exist, create a new one
        markers[id] = L.marker([latitude, longitude]).addTo(map);
        // Center the map when a new user is added
        map.setView([latitude, longitude], 15);
    }
});

// Listen for user disconnection to remove their marker
socket.on('user-disconnected', (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});


// Use watchPosition to track the user's location continuously
// Emit latitude and longitude via a socket with "send-location"
// Log any errors to the console

// Initialize a map centered at (0, 0) with zoom level 15 using Leaflet
// Add OpenStreetMap tiles to the map

// Create an empty object to store markers

// On receiving location data via the socket:
// - Extract id, latitude, and longitude
// - Center the map on the new coordinates

// If a marker for the id exists, update its position
// Otherwise, create a new marker at the given coordinates and add it to the map
// When a user disconnects, remove their marker from the map and delete it from markers
