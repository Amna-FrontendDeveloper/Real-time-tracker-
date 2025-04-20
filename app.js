const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    // Listen for location sharing
    socket.on('send-location', (data) => {
        io.emit('receive-location', { id: socket.id, ...data });
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        io.emit('user-disconnected', socket.id);
        console.log('User disconnected:', socket.id);
    });
});

// Route for the home page
app.get('/', (req, res) => {
    res.render('index');
});

// Start the server
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
