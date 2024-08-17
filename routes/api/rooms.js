const express = require('express');
const router = express.Router();
const roomsCtrl = require('../../controllers/api/rooms');
const ensureLoggedIn = require('../../config/ensureLoggedIn');

router.get('/', ensureLoggedIn, roomsCtrl.getRooms);
router.get('/:id', ensureLoggedIn, roomsCtrl.getRoomById);

router.post('/', ensureLoggedIn, roomsCtrl.createRoom);
router.put('/:id/name', roomsCtrl.updateRoomName);
router.delete('/:id', roomsCtrl.deleteRoom);

module.exports = router;
