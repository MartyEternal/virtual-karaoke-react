const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    artist: {
        type: String,
        trim: true
    },
    youtubeUrl: {
        type: String,
        required: true,
        trim: true
    }
});

const Song = mongoose.model('Song', songSchema);
module.exports = Song;
