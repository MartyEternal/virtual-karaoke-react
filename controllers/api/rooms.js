const Room = require('../../models/room');

module.exports = {
    getRooms,
    createRoom
};

async function getRooms(req, res) {
    try {
        const rooms = await Room.find({}).populate('host', 'username');
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
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
