import { createContext, useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import sendRequest from '../utilities/send-request';

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
                if (fetchedRoom.playlist && fetchedRoom.playlist.length > 0) {
                    setCurrentSong(fetchedRoom.playlist[0]);
                }
            } catch (err) {
                console.error('Error fetching room:', err);
            }
        }
        fetchRoom();
    }, [roomId]);

    return (
        <KaraokeRoomContext.Provider value={{ room, setRoom, newRoomName, setNewRoomName, playlist, setPlaylist, currentSong, setCurrentSong }}>
            {children}
        </KaraokeRoomContext.Provider>
    );
}
