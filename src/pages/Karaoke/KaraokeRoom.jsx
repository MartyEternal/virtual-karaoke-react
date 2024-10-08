import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useKaraokeRoom } from '../../context/KaraokeRoomContext';
import { updateRoomName, deleteRoom } from '../../utilities/karaoke-service';
import useSocket from '../../hooks/useSocket';
import SongSearchUI from './SongSearchUI';

export default function KaraokeRoom({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        room,
        setRoom,
        newRoomName,
        setNewRoomName,
        updateRoomName,
        playlist,
        setPlaylist,
        addSongToPlaylist,
        currentSong,
        setCurrentSong
    } = useKaraokeRoom();
    const [isEditing, setIsEditing] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [view, setView] = useState('playlist'); // Define state for view

    useSocket(id, user._id);

    function handleToggleView() {
        setView(view === 'playlist' ? 'people' : 'playlist');
    }

    function handleCopyLink() {
        navigator.clipboard.writeText(window.location.href);
        alert('Room link copied to clipboard!');
    }

    function handleEditRoomName() {
        if (isEditing && room) {
            updateRoomName(newRoomName);
        }
        setIsEditing(!isEditing);
    }

    function handleNameChange(evt) {
        setNewRoomName(evt.target.value);
    }

    function handleCancelEdit() {
        setIsEditing(false);
        setNewRoomName(room.name);
    }

    async function handleDeleteRoom() {
        if (room && window.confirm('Are you sure you want to delete this room?')) {
            try {
                await deleteRoom(room._id);
                navigate('/karaoke');
            } catch (error) {
                console.error('Error deleting room:', error);
            }
        }
    }

    function handleSongSearch() {
        setIsSearching(true);
    }

    function handleVideoSelect(video) {
        setPlaylist([...playlist, video]);
        if (!currentSong) {
            setCurrentSong(video);
        }
        setIsSearching(false);
    }

    function handleBack() {
        setIsSearching(false);
    }

    function handleMoveSongUp(index) {
        if (index > 0) {
            const newPlaylist = [...playlist];
            [newPlaylist[index - 1], newPlaylist[index]] = [newPlaylist[index], newPlaylist[index - 1]];
            setPlaylist(newPlaylist);
            if (index - 1 === 0) {
                setCurrentSong(newPlaylist[0]);
            }
        }
    }

    function handleMoveSongDown(index) {
        if (index < playlist.length - 1) {
            const newPlaylist = [...playlist];
            [newPlaylist[index + 1], newPlaylist[index]] = [newPlaylist[index], newPlaylist[index + 1]];
            setPlaylist(newPlaylist);
            if (index + 1 === 0) {
                setCurrentSong(newPlaylist[0]);
            }
        }
    }

    function handleDeleteSong(index) {
        const newPlaylist = playlist.filter((_, i) => i !== index);
        setPlaylist(newPlaylist);
        if (index === 0 && newPlaylist.length > 0) {
            setCurrentSong(newPlaylist[0]);
        } else if (newPlaylist.length === 0) {
            setCurrentSong(null); // Clear the current song if the playlist is empty
        }
    }

    return (
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto mt-8 p-4">
            {/* Main Video Section */}
            <div className="w-full md:w-3/4 p-4">
                {isSearching ? (
                    <SongSearchUI onVideoSelect={handleVideoSelect} onBack={handleBack} />
                ) : (
                    currentSong ? (
                        <iframe
                            width="100%"
                            height="400"
                            src={`https://www.youtube.com/embed/${currentSong.youtubeUrl}`}
                            title={currentSong.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="flex items-center justify-center h-96 bg-gray-200">
                            <p>No song selected</p>
                        </div>
                    )
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
                    {isEditing ? (
                        <input
                            type="text"
                            value={newRoomName}
                            onChange={handleNameChange}
                            className="border rounded p-1 w-full"
                        />
                    ) : (
                        <h3 className="text-xl font-semibold">{room?.name || 'Room Name'}</h3>
                    )}
                    {isEditing ? (
                        <div>
                            <button
                                onClick={handleEditRoomName}
                                className="text-green-500 hover:text-green-600 mr-2"
                            >
                                Save
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="text-red-500 hover: text-red-600"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        user && user._id === room?.host._id && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-blue-500 hover:text-blue-600"
                            >
                                ✏️
                            </button>
                        )
                    )}
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
                                <li key={index} className="mb-2 flex items-center justify-between">
                                    <div>
                                        {index + 1}. {song.title}
                                    </div>
                                    <div className="flex">
                                        <button onClick={() => handleMoveSongUp(index)} disabled={index === 0}>
                                            ▲
                                        </button>
                                        <button onClick={() => handleMoveSongDown(index)} disabled={index === playlist.length - 1}>
                                            ▼
                                        </button>
                                        <button onClick={() => handleDeleteSong(index)} className="text-red-500 ml-2">
                                            🗑️
                                        </button>
                                    </div>
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
                {user && user._id === room?.host._id && (
                    <button
                        onClick={handleDeleteRoom}
                        className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600"
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
}
