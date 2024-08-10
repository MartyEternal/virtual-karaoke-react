import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sendRequest from '../../utilities/send-request';

export default function KaraokeNewRoom() {
    const [name, setName] = useState('');
    const [maxParticipants, setMaxParticipants] = useState(10);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const newRoom = await sendRequest('/api/rooms', 'POST', { name, maxParticipants });
            navigate(`/karaoke/${newRoom._id}`);
        } catch (err) {
            setError('Failed to create a new room. Please try again.');
        }
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-4 shadow-lg rounded-lg bg-white">
            <h2 className="text-xl font-semibold mb-4">Create New Karaoke Room</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700">
                        Room Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="maxParticipants" className="block text-gray-700">
                        Max Number of Participants
                    </label>
                    <input
                        type="number"
                        id="maxParticipants"
                        value={maxParticipants}
                        onChange={(e) => setMaxParticipants(e.target.value)}
                        min="1"
                        max="100"
                        required
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
                >
                    Create Room
                </button>
            </form>
        </div>
    );
}
