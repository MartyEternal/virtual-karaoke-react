const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
// Always require and configure near the top
require('dotenv').config();
// Connect to the database
require('./config/database');

const app = express();

// socket.io setup
const { createServer } = require('http');
const { Server } = require('socket.io');
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const Room = require('./models/room');

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listening for user joining a room
  socket.on('joinRoom', async ({ roomId, userId }) => {
    try {
      // Attach userId to socket for later use
      socket.userId = userId;

      socket.join(roomId); // Adds user to a specific room
      console.log(`User ${userId} joined room ${roomId}`);

      // Update room's user list in the database
      const room = await Room.findById(roomId);
      if (room && !room.users.includes(userId)) {
        room.users.push(userId);
        if (!room.host) {
          room.host = userId;
        }
        await room.save();
      }

      // Notify others in the room that a new user has joined
      socket.to(roomId).emit('userJoined', { userId, roomId });
      io.to(roomId).emit('roomUpdated', room);
    } catch (err) {
      console.error('Error joining room:', err);
    }
  });

  socket.on('disconnect', async () => {
    try {
      if (!socket.userId) {
        console.warn('No userId found on socket, skipping disconnect handling');
        return;
      }

      console.log('A user disconnected:', socket.id);

      // Find the room that the user was in
      const room = await Room.findOne({ users: socket.userId });
      if (room) {
        // Remove user from the room's user list
        room.users = room.users.filter(userId => userId && userId.toString() !== socket.userId);

        if (room.host.toString() === socket.userId) {
          room.host = room.users.length > 0 ? room.users[0] : null;
        }

        await room.save();

        // Notify others in the room that the user has left
        io.to(room._id).emit('userLeft', { userId: socket.userId, roomId: room._id, newHost: room.host });
        io.to(room._id).emit('roomUpdated', room);
      } else {
        console.warn('No room found for user during disconnect');
      }
    } catch (err) {
      console.error('Error during disconnection:', err);
    }
  });

  socket.on('leaveRoom', async ({ roomId, userId }) => {
    try {
      if (!roomId || !userId) {
        console.error('Missing roomId or userId in leaveRoom');
        return;
      }

      socket.leave(roomId);
      console.log(`User ${userId} left room ${roomId}`);

      // Update the room's user list in the database
      const room = await Room.findById(roomId);
      if (room) {
        room.users = room.users.filter(id => id && id.toString() !== userId);

        if (room.host.toString() === userId) {
          room.host = room.users.length > 0 ? room.users[0] : null;
        }

        await room.save();
      }

      // Notify others in the room that a user has left
      io.to(roomId).emit('userLeft', { userId, roomId, newHost: room.host });
      io.to(roomId).emit('roomUpdated', room);
    } catch (err) {
      console.error('Error leaving room:', err);
    }
  });
});

app.use(logger('dev'));
app.use(express.json());

// Configure both serve-favicon & static middleware
// to serve from the production 'build' folder
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));

// Middleware to check and verify a JWT and
// assign the user object from the JWT to req.user
app.use(require('./config/checkToken'));

const port = process.env.PORT || 3001;

// Put API routes here, before the "catch all" route
app.use('/api/rooms', require('./routes/api/rooms'));
app.use('/api/users', require('./routes/api/users'));

// The following "catch all" route (note the *) is necessary
// to return the index.html on all non-AJAX/API requests
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

httpServer.listen(port, function () {
  console.log(`Express app running on port ${port}`);
});
