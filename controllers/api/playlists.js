const Room = require('../../models/room');
const Playlist = require('../../models/playlist');
const Song = require('../../models/song');

module.exports = {
    addSongToPlaylistView,
}

async function addSongToPlaylistView(req, res) {
    const { roomId, video } = req.body;

    try {
        let song = await Song.findOne({ youtubeUrl: video.youtubeUrl });
        if (!song) {
            song = new Song(video);
            await song.save();
        }

        const room = await Room.findById(roomId).populate('playlist');
        if (!room) return res.status(404).json({ error: 'Room not found' });

        const nextPosition = room.playlist.length;

        const playlistEntry = new Playlist({
            room: roomId,
            song: song._id,
            position: nextPosition
        });

        await playlistEntry.save();

        room.playlist.push(playlistEntry._id);
        if (!room.currentSong) {
            room.currentSong = song._id;
        }
        await room.save();

        // const populatedRoom = await Room.findById(roomId).populate('playlist song').populate('currentSong');
        const populatedRoom = await Room.findById(roomId)
            .populate({
                path: 'playlist',
                populate: { path: 'song' }
            })
            .populate('currentSong');

        req.io.to(roomId).emit('roomUpdated', populatedRoom);

        res.json(populatedRoom);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}