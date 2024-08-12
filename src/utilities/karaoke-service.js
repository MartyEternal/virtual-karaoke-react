import sendRequest from "./send-request"

const BASE_URL = '/api/rooms';

export function updateRoomName(id, newName) {
    return sendRequest(`${BASE_URL}/${id}/name`, 'PUT', { name: newName });
}