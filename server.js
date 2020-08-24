const express = require('express');
const path = require('path');
const http = require('http');
const formatMessage = require('./utils/messages');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'The awesome ChatBot';

io.on('connect', (socket) => {
  // Only to the connected user
  socket.emit(
    'message',
    formatMessage(botName, 'This is a welcome message to Chat App')
  );

  // To all users accept the connected user when a user connects
  socket.broadcast.emit(
    'message',
    formatMessage(botName, 'A user has joined the chat')
  );

  // To all the users when a user disconnects
  socket.on('disconnect', () => {
    io.emit('message', formatMessage(botName, 'A user has left the chat'));
  });

  // Listen for chat message
  socket.on('chatMessage', (message) => {
    io.emit('message', formatMessage('***user***', message));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`server is running on port: ${PORT}`));
