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
const User = require('./models/user');
const MAX_RETRIES = 3;

async function saveRoomRetries(room, retries = 0) {
  try {
    await room.save();
  } catch (err) {
    if (err.name === 'VersionError' && retries < MAX_RETRIES) {
      console.warn(`Version conflict detected. Retrying save operation... Attempt ${retries + 1}`);
      const freshRoom = await Room.findById(room._id);
      freshRoom.users = room.users;
      return saveRoomRetries(freshRoom, retries + 1);
    } else {
      throw err;
    }
  }
}

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
        await saveRoomRetries(room);

        const populatedRoom = await Room.findById(roomId).populate('users', 'username');

        io.to(roomId).emit('roomUpdated', populatedRoom);
      }

      // Notify others in the room that a new user has joined
      socket.to(roomId).emit('userJoined', { userId, roomId });
    } catch (err) {
      console.error('Error joining room:', err);
    }
  });

  socket.on('disconnect', async ({ roomId, userId }) => {
    try {
      if (!socket.userId) {
        console.warn('No userId found on socket, skipping disconnect handling');
        return;
      }

      console.log('A user disconnected:', socket.userId);

      // Find the room that the user was in
      const room = await Room.findOne({ users: socket.userId });
      if (room) {
        // Remove user from the room's user list
        room.users = room.users.filter(userId => userId && userId.toString() !== socket.userId);
        await saveRoomRetries(room);;

        const populatedRoom = await Room.findById(roomId).populate('users', 'username');

        io.to(roomId).emit('roomUpdated', populatedRoom);
        // Notify others in the room that the user has left
        socket.to(roomId).emit('userLeft', { userId: userId, roomId: roomId });
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
        await saveRoomRetries(room);

        const populatedRoom = await Room.findById(roomId).populate('users', 'username');

        io.to(roomId).emit('roomUpdated', populatedRoom);
      }

      // Notify others in the room that a user has left
      socket.to(roomId).emit('userLeft', { userId, roomId });
    } catch (err) {
      console.error('Error leaving room:', err);
    }
  });
});

app.use(logger('dev'));
app.use(express.json());
app.use((req, res, next) => {
  req.io = io;
  next();
});

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
app.use('/api/playlists', require('./routes/api/playlists'));

// The following "catch all" route (note the *) is necessary
// to return the index.html on all non-AJAX/API requests
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

httpServer.listen(port, function () {
  console.log(`Express app running on port ${port}`);
});
