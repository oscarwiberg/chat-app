const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connect', (socket) => {
  console.log('New web socket connection');
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`server is running on port: ${PORT}`));
