const Room = require('../../models/room');

module.exports = {
    getRooms,
    getRoomById,
    createRoom,
    updateRoomName,
    deleteRoom,
};

async function getRooms(req, res) {
    try {
        const rooms = await Room.find({}).populate('host', 'username');
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function getRoomById(req, res) {
    try {
        const roomId = req.params.id;
        const room = await Room.findById(roomId).populate('host', 'username').populate('users', 'username');

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json(room);
    } catch (err) {
        console.error('Error fetching room by ID:', err);
        res.status(500).json({ error: 'Failed to fetch room' });
    }
}

async function createRoom(req, res) {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Room name is required' });

        const newRoom = new Room({
            name,
            host: req.user._id,
            users: [req.user._id]
        });

        const room = await newRoom.save();

        res.status(201).json(room);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function updateRoomName(req, res) {
    try {
        const roomId = req.params.id;
        const newName = req.body.name;

        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            { name: newName },
            { new: true }
        );

        if (!updatedRoom) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json(updatedRoom);
    } catch (err) {
        console.error('Error updating room name:', err);
        res.status(500).json({ error: 'Failed to update room name' });
    }
}

async function deleteRoom(req, res) {
    try {
        const roomId = req.params.id;

        const roomToDelete = await Room.findByIdAndDelete(roomId);
        if (!roomToDelete) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.status(200).json({ message: 'Room successfully deleted' });
    } catch (err) {
        console.error('Error deleting room:', err);
        res.status(500).json({ error: 'Failed to delete room' });
    }
}