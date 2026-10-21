import roomService from "../services/room.service.js";
import { pool } from "../db/db.js";
import { rooms } from "../store/room.store.js";

async function CreateRoom(req, res) {
     try {

        const hostId = req.user.id; //the req.user we got from verifyUser middleware which contains the real postgreSql id of that user

        const user = await pool.query(
            `SELECT username,profile_pic
             FROM user_accs
             WHERE id = $1`,
            [hostId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const username = user.rows[0].username;
        const profilePic = user.rows[0].profile_pic;

        const response = roomService.createRoom(
            hostId,
            username,
            profilePic
        );
        return res.status(201).json(response);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

async function JoinRoom(req, res) {
    try {
        const { roomId } = req.body;
        const userId = req.user.id;

        const user = await pool.query(
            `SELECT username, profile_pic
             FROM user_accs
             WHERE id = $1`,
            [userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const username = user.rows[0].username;
        const profilePic = user.rows[0].profile_pic;

        const participant = {
            userId,
            username,
            profile_pic: profilePic
        };

        const response = roomService.joinRoom(
            roomId,
            participant
        );

        if (!response.success) {
            return res.status(404).json(response);
        }

        return res.status(200).json(response);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

function GetRoom(req, res) {

    const { roomId } = req.params;

    const response = roomService.getRoom(roomId);

    if (!response.success) {
        return res.status(404).json(response);
    }

    return res.status(200).json(response);
}

function EndRoom(req, res) {

    const { roomId } = req.params;

    const userId = req.user.id; //got already by verifyUser middleware 

     const response = roomService.endRoom(
        roomId,
        userId
    );

    if (!response.success) {
        return res.status(403).json(response);
    }

    return res.status(200).json(response);
}

function LeaveRoom(req, res) {

    const { roomId } = req.params;

    const userId = req.user.id;

    const response = roomService.leaveRoom(
        roomId,
        userId
    );

    if (!response.success) {
        return res.status(response.statusCode || 400).json(response);
    }

    return res.status(200).json(response);
}

export default {
    CreateRoom,
    JoinRoom,
    GetRoom,
    EndRoom,
    LeaveRoom
};