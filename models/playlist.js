const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    song: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
        required: true
    },
    position: {
        type: Number,
        required: true
    }
});

const Playlist = mongoose.model('Playlist', playlistSchema);
module.exports = Playlist;
