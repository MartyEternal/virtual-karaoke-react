const Room = require('../../models/room');
const Playlist = require('../../models/playlist');
const Song = require('../../models/song');

module.exports = {
    addSongToPlaylistView,
}

async function addSongToPlaylistView(req, res) {
    const { roomId, video } = req.body;
    console.log('Received video object:', video);
    console.log('Received req body:', req.body);

    try {
        let song = await Song.findOne({ youtubeUrl: video.youtubeUrl });
        if (!song) {
            song = new Song({
                youtubeUrl: video.youtubeUrl,
                title: video.title
            });
            await song.save();
        }

        if (!song || !song._id) {
            console.error('Error: Song not found or not created properly.', song);
            return res.status(500).json({ error: 'Song could not be found or created.' });
        }

        const room = await Room.findById(roomId).populate('playlist');
        if (!room) return res.status(404).json({ error: 'Room not found' });

        const nextPosition = room.playlist.length;

        const playlistEntry = new Playlist({
            room: roomId,
            song: song,
            position: nextPosition
        });
        console.log(song._id);

        await playlistEntry.save();

        room.playlist.push(playlistEntry._id);
        if (!room.currentSong) {
            room.currentSong = song._id;
        }
        await room.save();

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