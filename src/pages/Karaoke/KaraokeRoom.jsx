import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import sendRequest from '../../utilities/send-request';

export default function KaraokeRoom() {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const [view, setView] = useState('playlist'); // toggle defaults to playlist
    const [currentSong, setCurrentSong] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchRoom() {
            try {
                const fetchedRoom = await sendRequest(`/api/rooms/${id}`, 'GET');
                setRoom(fetchedRoom);
                setPlaylist(fetchedRoom.playlist || []);
                if (fetchedRoom.playlist && fetchedRoom.playlist.length > 0) {
                    setCurrentSong(fetchedRoom.playlist[0]);
                }
            } catch (err) {
                setError('Failed to load room data. Please try again later.');
            }
        }
        fetchRoom();
    }, [id]);

    function handleToggleView() {
        setView(view === 'playlist' ? 'people' : 'playlist');
    }

    function handleCopyLink() {
        navigator.clipboard.writeText(window.location.href);
        alert('Room link copied to clipboard!');
    }

    function handleEditRoomName() {
        // space for editing room name
    }

    function handleSongSearch() {
        navigate(`/karaoke/${id}/search`);
    }

    return (
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto mt-8 p-4">
            {/* Main Video Section */}
            <div className="w-full md:w-3/4 p-4">
                {currentSong ? (
                    <iframe
                        width="100%"
                        height="400"
                        src={`https://www.youtube.com/embed/${currentSong.youtubeUrl}`}
                        title={currentSong.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <div className="flex items-center justify-center h-96 bg-gray-200">
                        <p>No song selected</p>
                    </div>
                )}
                <button
                    onClick={handleSongSearch}
                    className="mt-4 w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
                >
                    Song Search
                </button>
            </div>

            {/* Right Section */}
            <div className="w-full md:w-1/4 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{room?.name || 'Room Name'}</h3>
                    <button onClick={handleEditRoomName} className="text-blue-500 hover:text-blue-600">
                        ✏️
                    </button>
                </div>
                <div className="mb-4">
                    <button
                        onClick={handleToggleView}
                        className={`py-2 px-4 w-1/2 text-center ${view === 'playlist' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Playlist
                    </button>
                    <button
                        onClick={handleToggleView}
                        className={`py-2 px-4 w-1/2 text-center ${view === 'people' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        People
                    </button>
                </div>
                <div className="overflow-y-auto max-h-64">
                    {view === 'playlist' ? (
                        <ul>
                            {playlist.map((song, index) => (
                                <li key={index} className="mb-2">
                                    {index + 1}. {song.title}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <ul>
                            {room?.users.map((user, index) => (
                                <li key={index} className="mb-2">
                                    {user.username}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button
                    onClick={handleCopyLink}
                    className="mt-4 w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600"
                >
                    Invite
                </button>
            </div>
        </div>
    );
}
