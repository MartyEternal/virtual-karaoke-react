import sendRequest from "./send-request"

const BASE_URL = '/api/rooms';

export function updateRoomName(id, newName) {
    return sendRequest(`${BASE_URL}/${id}/name`, 'PUT', { name: newName });
}

export function deleteRoom(id) {
    return sendRequest(`${BASE_URL}/${id}`, 'DELETE');
}

export function addSongToPlaylist(roomId, video) {
    return sendRequest(`/api/playlists/add`, 'POST', { roomId, video });
}