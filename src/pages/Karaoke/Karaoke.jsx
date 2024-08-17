import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import sendRequest from '../../utilities/send-request';
import io from 'socket.io-client';

export default function Karaoke() {
    const [rooms, setRooms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchRooms() {
            try {
                const fetchedRooms = await sendRequest('/api/rooms', 'GET');
                setRooms(fetchedRooms);
            } catch (err) {
                setError('Failed to load karaoke rooms. Please try again later.');
            }
        }
        fetchRooms();

        // unfortunately, trying to make the KaraokeRoomContext component more broad wasn't successful
        const socketUrl = process.env.NODE_ENV === 'production'
            ? 'https://virtual-karaoke-react.onrender.com'
            : 'http://localhost:3001';

        const socket = io(socketUrl, {
            transports: ['websocket'],
            reconnectionAttempts: 5,
        });

        socket.on('roomUpdated', (updatedRoom) => {
            setRooms(prevRooms => {
                const index = prevRooms.findIndex(room => room._id === updatedRoom._id);
                if (index !== -1) {
                    const updatedRooms = [...prevRooms];
                    updatedRooms[index] = updatedRoom;
                    return updatedRooms;
                }
                return prevRooms;
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function handleCreateRoom() {
        navigate('/karaoke/new');
    }

    function handleSearchChange(evt) {
        setSearchTerm(evt.target.value);
    }

    return (
        <div className="max-w-4xl mx-auto mt-8 p-4">
            <h2 className="text-2xl font-semibold flex justify-center">Join in for Karaoke</h2>
            <p className="text-center text-gray-600 mb-4">Join your friends or jump into a public room, you're always welcome.</p>

            <div className="flex justify-between items-center mb-8">
                <input
                    type="text"
                    placeholder="Search karaoke rooms"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex justify-between">
                <h3 className="mb-2 text-lg font-medium px-4 py-2">Public Rooms</h3>
                <button
                    onClick={handleCreateRoom}
                    className="mb-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
                >
                    Create Room
                </button>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {filteredRooms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredRooms.map(room => (
                        <Link to={`/karaoke/${room._id}`} key={room._id}>
                            <div key={room._id} className="p-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-100">
                                <h3 className="text-lg font-medium">{room.name}</h3>
                                <p className="text-sm text-gray-500">Current Song: {room.currentSong?.title || 'N/A'}</p>
                                <p className="text-sm text-gray-500">People: {room.users.length || 0}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No public rooms available. Please try searching for a different room.</p>
            )}
        </div>
    );
}
