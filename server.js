const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
// Always require and configure near the top
require('dotenv').config();
// Connect to the database
require('./config/database');

const app = express();

// socket.io stuff
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

  // listening for user joining a room
  socket.on('joinRoom', async (roomId) => {
    try {
      socket.join(roomId); // adds user to a specific room
      console.log(`User ${socket.id} joined room ${roomId}`);

      // this will update room's user list in the database
      const room = await Room.findById(roomId);
      if (room) {
        room.users.push(socket.id);
        await room.save();
      }
      // tell others in the room that a new user has joined
      socket.to(roomId).emit('userJoined', { userId: socket.id, roomId });
    } catch (err) {
      console.error('Error joining room:', err);
    }// needs to update and query db from within this function, then copy to other socket functions
  });

  socket.on('disconnect', async () => {
    try {
      console.log('A user disconnected:', socket.id);

      // room that the user was in
      const room = await Room.findOne({ users: socket.id });
      if (room) {
        // take user out of room's user list
        room.users = room.users.filter(userId => userId !== socket.id);
        await room.save();

        // tell others the user left the room
        socket.to(room._id_.emit('userLeft', { userId: socket.id, roomId: room._id }));
      }
    } catch (err) {
      console.error('Error during disconnection:', err);
    }
  });

  socket.on('leaveRoom', async (roomId) => {
    try {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);

      // updating room's user list in db
      const room = await Room.findById(roomId);
      if (room) {
        room.users = room.users.filter(userId => userId !== socket.id);
        await room.save();
      }

      // tell others in the room that a user left
      socket.to(roomId).emit('userLeft', { userId: socket.id, roomId });
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
