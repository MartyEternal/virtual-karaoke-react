import { useEffect } from "react";
import io from 'socket.io-client';

export default function useSocket(roomId, userId) {
    useEffect(() => {
        const socketUrl = process.env.NODE_ENV === 'production'
            ? 'https://virtual-karaoke-react.onrender.com'
            : 'http://localhost:3000';

        const socket = io(socketUrl);

        // join room when the hook is used
        // socket.emit('joinRoom', roomId);
        socket.emit('joinRoom', { roomId, userId });

        // listening for events
        socket.on('userJoined', (data) => {
            console.log(`User ${data.userId} joined the room ${data.roomId}`);
        });

        socket.on('userLeft', (data) => {
            console.log(`User ${data.userId} left room ${data.roomId}`);
        });

        // remove socket connection when hook is no longer used
        return () => {
            socket.emit('leaveRoom', roomId, userId);
            socket.disconnect();
        };
    }, [roomId, userId]);
};