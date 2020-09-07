const express = require('express');
const path = require('path');
const http = require('http');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users');
const socketio = require('socket.io');
const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'The awesome ChatBot';

io.on('connect', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Only to the connected user
    socket.emit(
      'message',
      formatMessage(botName, 'This is a welcome message to Chat App')
    );

    // To all users accept the connected user when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chat message
  socket.on('chatMessage', (message) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, message));
  });

  // To all the users when a user disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`server is running on port: ${PORT}`));
