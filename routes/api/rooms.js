const express = require('express');
const router = express.Router();
const roomsCtrl = require('../../controllers/api/rooms');
const ensureLoggedIn = require('../../config/ensureLoggedIn');

// Route to get a room by ID
// router.get('/:id', roomsCtrl.getRoomById);
router.get('/', ensureLoggedIn, roomsCtrl.getRooms);
router.get('/:id', ensureLoggedIn, roomsCtrl.getRoomById);

router.post('/', ensureLoggedIn, roomsCtrl.createRoom);
router.put('/:id/name', roomsCtrl.updateRoomName);
router.delete('/:id', roomsCtrl.deleteRoom);

module.exports = router;
