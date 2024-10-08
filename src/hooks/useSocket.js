import { useEffect } from "react";
import io from 'socket.io-client';
import { useKaraokeRoom } from "../context/KaraokeRoomContext";

export default function useSocket(roomId, userId) {
    const { setRoom } = useKaraokeRoom();

    useEffect(() => {
        const socketUrl = process.env.NODE_ENV === 'production'
            ? 'https://virtual-karaoke-react.onrender.com'
            : 'http://localhost:3001';

        const socket = io(socketUrl, {
            transports: ['websocket'],
            reconnectionAttempts: 5,
        });

        // join room when the hook is used
        socket.emit('joinRoom', { roomId, userId });

        // this baby will listen for changes in the room
        socket.on('roomUpdated', (updatedRoom) => {
            setRoom(updatedRoom);
        });

        // listening for events
        socket.on('userJoined', (data) => {
            console.log(`User ${data.userId} joined the room ${data.roomId}`);
        });

        socket.on('userLeft', (data) => {
            console.log(`User ${data.userId} left room ${data.roomId}`);
        });

        // remove socket connection when hook is no longer used
        return () => {
            socket.emit('leaveRoom', { roomId, userId });
            socket.disconnect();
        };
    }, [roomId, userId, setRoom]);
};