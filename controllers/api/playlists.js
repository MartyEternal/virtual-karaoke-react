const Room = require('../../models/room');
const Playlist = require('../../models/playlist');
const Song = require('../../models/song');

module.exports = {
    addSongToPlaylistView,
}

async function addSongToPlaylistView(roomId, songData) {
    const room = await Room.findById(roomId).populate('playlist').populate('currentSong');
    if (!room) throw new Error('Room not found');

    let song = await Song.findOne({ youtubeUrl: songData.youtubeUrl });
    if (!song) {
        song = new Song(songData);
        await song.save();
    }

    const nextPosition = room.playlist.length;

    const playlistEntry = new Playlist({
        room: roomId,
        song: song._id,
        position: nextPosition
    });
    await playlistEntry.save();

    room.playlist.push(playlistEntry._id);
    await room.save();

    return await Room.findById(roomId).populate('playlist').populate('currentSong');
}

