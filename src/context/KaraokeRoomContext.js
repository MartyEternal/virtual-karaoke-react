import { createContext, useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import sendRequest from '../utilities/send-request';
import { addSongToPlaylist as addSongToPlaylistService, updateRoomName as updateRoomNameService } from '../utilities/karaoke-service';

const KaraokeRoomContext = createContext();

export function useKaraokeRoom() {
    return useContext(KaraokeRoomContext);
}

export function KaraokeRoomProvider({ children }) {
    const { id: roomId } = useParams(); // Get the room ID from params
    const [room, setRoom] = useState(null);
    const [newRoomName, setNewRoomName] = useState('');
    const [playlist, setPlaylist] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);

    useEffect(() => {
        async function fetchRoom() {
            try {
                const fetchedRoom = await sendRequest(`/api/rooms/${roomId}`, 'GET');
                setRoom(fetchedRoom);
                setNewRoomName(fetchedRoom.name);
                setPlaylist(fetchedRoom.playlist || []);
                setCurrentSong(fetchedRoom.currentSong || (fetchedRoom.playlist && fetchedRoom.playlist[0]));
            } catch (err) {
                console.error('Error fetching room:', err);
            }
        }
        fetchRoom();
    }, [roomId]);

    async function addSongToPlaylist(video) {
        try {
            const updatedRoom = await addSongToPlaylistService(roomId, video);
            setRoom(updatedRoom);
            setPlaylist(updatedRoom.playlist);
            if (!currentSong) {
                setCurrentSong(updatedRoom.currentSong || video);
            }
        } catch (err) {
            console.error('Error adding song to playlist:', err);
        }
    }

    async function updateRoomName(newName) {
        try {
            const updatedRoom = await updateRoomNameService(roomId, newName);
            setRoom(updatedRoom);
            setNewRoomName(updatedRoom.name);
        } catch (err) {
            console.error('Error updating room name:', err);
        }
    }

    return (
        <KaraokeRoomContext.Provider value={{
            room,
            setRoom,
            newRoomName,
            setNewRoomName,
            playlist,
            setPlaylist,
            currentSong,
            setCurrentSong,
            addSongToPlaylist,
            updateRoomName,
        }}>
            {children}
        </KaraokeRoomContext.Provider>
    );
}
