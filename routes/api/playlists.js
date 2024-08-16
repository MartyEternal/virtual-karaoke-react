const express = require('express');
const router = express.Router();
const playlistsCtrl = require('../../controllers/api/playlists');

router.post('/add', playlistsCtrl.addSongToPlaylistView);

module.exports = router;