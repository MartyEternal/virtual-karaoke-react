const express = require('express');
const router = express.Router();
const roomsCtrl = require('../../controllers/api/rooms');
const ensureLoggedIn = require('../../config/ensureLoggedIn');

// Route to get a room by ID
// router.get('/:id', roomsCtrl.getRoomById);
router.get('/', ensureLoggedIn, roomsCtrl.getRooms);

router.post('/', ensureLoggedIn, roomsCtrl.createRoom);

module.exports = router;
