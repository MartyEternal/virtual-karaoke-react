const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    playlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist'
    }],
    currentSong: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
