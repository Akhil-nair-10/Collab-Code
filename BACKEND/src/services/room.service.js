import crypto from "crypto";
import { rooms } from "../store/room.store.js";


function createRoom(hostId, username, profilePic) {

    const roomId = crypto.randomUUID();

    const room = {
        roomId,

        host: {
            userId: hostId,
            username: username,
            profile_pic: profilePic
        },

        language: "javascript",

        readOnly: false,

        participants: [],

        createdAt: new Date()
    };

    rooms.set(roomId, room);

    return {
        roomId
    };
}


function joinRoom(roomId, user) {

    const room = rooms.get(roomId);

    if (!room) {
        return {
            success: false,
            message: "Room does not exist."
        };
    }

    const alreadyJoined = room.participants.find(
        participant => participant.userId === user.userId
    );

    if (alreadyJoined) {
        return {
            success: false,
            message: "User already joined."
        };
    }

    room.participants.push(user);

    return {
        success: true,
        participants: room.participants
    };
}


function getRoom(roomId) {

    const room = rooms.get(roomId);

    if (!room) {
        return {
            success: false,
            message: "Room not found."
        };
    }

    return {
        success: true,

        admin: {
            userId: room.host.userId,
            username: room.host.username,
            profile_pic: room.host.profile_pic
        },

        roomId: room.roomId,

        readOnly: room.readOnly,

        participants: room.participants
    };
}


function endRoom(roomId, userId) {

    const room = rooms.get(roomId);

    if (!room) {
        return {
            success: false,
            message: "Room not found."
        };
    }

    if (room.host.userId !== userId) {
        return {
            success: false,
            message: "Only the host can end the session."
        };
    }

    rooms.delete(roomId);

    return {
        success: true,
        message: "Session ended successfully."
    };
}


function leaveRoom(roomId, userId) {

    const room = rooms.get(roomId);

    if (!room) {
        return {
            success: false,
            statusCode: 404,
            message: "Room not found."
        };
    }

    /*
     * NORMAL PARTICIPANT LEAVING
     */

    if (room.host.userId !== userId) {

        const wasParticipant = room.participants.find(
            participant => participant.userId === userId
        );

        if (!wasParticipant) {
            return {
                success: false,
                statusCode: 404,
                message: "User is not part of this room."
            };
        }

        room.participants = room.participants.filter(
            participant => participant.userId !== userId
        );

        return {
            success: true,
            sessionEnded: false,
            hostChanged: false,
            participants: room.participants
        };
    }

    /*
     * HOST LEAVING
     */

    if (room.participants.length === 0) {

        rooms.delete(roomId);

        return {
            success: true,
            sessionEnded: true
        };
    }

    /*
     * TRANSFER HOST TO FIRST PARTICIPANT
     */

    const newHost = room.participants[0];

    room.host = {
        userId: newHost.userId,
        username: newHost.username,
        profile_pic: newHost.profile_pic
    };

    room.participants = room.participants.filter(
        participant => participant.userId !== newHost.userId
    );

    return {
        success: true,
        sessionEnded: false,
        hostChanged: true,
        newHost: room.host,
        participants: room.participants
    };
}


export default {
    createRoom,
    joinRoom,
    getRoom,
    endRoom,
    leaveRoom
};