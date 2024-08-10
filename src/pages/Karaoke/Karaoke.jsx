import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import sendRequest from '../../utilities/send-request';

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
    }, []);

    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function handleCreateRoom() {
        navigate('/karaoke/new');
    }

    function handleSearchChange(e) {
        setSearchTerm(e.target.value);
    }

    return (
        <div className="max-w-4xl mx-auto mt-8 p-4">
            <h2 className="text-2xl font-semibold mb-6">Join in for Karaoke</h2>
            <p className="text-center text-gray-600 mb-4">Join your friends or jump into a public room, you're always welcome.</p>

            <div className="flex justify-between items-center mb-8">
                <input
                    type="text"
                    placeholder="Search karaoke rooms"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleCreateRoom}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
                >
                    Create Room
                </button>
            </div>

            <h3 className="text-lg font-medium mb-4">Public Rooms</h3>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {filteredRooms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredRooms.map(room => (
                        <Link to={`/karaoke/${room._id}`} key={room._id}>
                            <div key={room._id} className="p-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-100">
                                <h3 className="text-lg font-medium">{room.name}</h3>
                                <p className="text-sm text-gray-500">Current Song: {room.currentSong || 'N/A'}</p>
                                <p className="text-sm text-gray-500">People: {room.participantsCount || 0}</p>
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
