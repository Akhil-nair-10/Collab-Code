import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";
import { rooms } from "../store/room.store.js";


function roomSocket(io) {

    io.on("connection", async (socket) => {

        try {

            // Get JWT cookie from Socket.IO handshake
            const cookieHeader = socket.handshake.headers.cookie;

            if (!cookieHeader) {
                socket.disconnect(true);
                return;
            }


            // Find the Token cookie
            const cookies = cookieHeader
                .split(";")
                .reduce((acc, cookie) => {

                    const [key, value] = cookie.trim().split("=");

                    acc[key] = value;

                    return acc;

                }, {});


            // Support both 'token' and legacy 'Token' cookie names
            const token = cookies.token || cookies.Token;

            if (!token) {
                socket.disconnect(true);
                return;
            }


            // Verify JWT
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );


            // Store authenticated user on socket
            socket.user = {
                id: decoded.id
            };


            console.log(
                "Authenticated socket:",
                socket.id,
                "User ID:",
                socket.user.id
            );


            socket.on("join-room", async (roomId) => {

                try {

                    const room = rooms.get(roomId);

                    if (!room) {
                        socket.emit("room-error", {
                            message: "Room does not exist."
                        });

                        return;
                    }


                    // Get the REAL user from PostgreSQL
                    const user = await pool.query(
                        `SELECT username, profile_pic
                         FROM user_accs
                         WHERE id = $1`,
                        [socket.user.id]
                    );


                    if (user.rows.length === 0) {

                        socket.emit("room-error", {
                            message: "User not found."
                        });

                        return;
                    }


                    const username = user.rows[0].username;
                    const profilePic = user.rows[0].profile_pic;


                    // Host does NOT belong to participants
                    const isHost =
                        room.host.userId === socket.user.id;


                    // If host joins, simply join the socket room
                    if (isHost) {

                        socket.join(roomId);

                        socket.roomId = roomId;

                        console.log(
                            `${username} joined room ${roomId} as host`
                        );

                        return;
                    }


                    // Check whether this user is actually
                    // present in the room's participant list
                    const participant = room.participants.find(
                        participant =>
                            participant.userId === socket.user.id
                    );


                    if (!participant) {

                        socket.emit("room-error", {
                            message: "You have not joined this room."
                        });

                        return;
                    }


                    // Join Socket.IO room
                    socket.join(roomId);

                    socket.roomId = roomId;


                    console.log(
                        `${username} joined room ${roomId}`
                    );


                    // Tell everyone ELSE that this participant
                    // has connected
                    socket.to(roomId).emit(
                        "participant-joined",
                        {
                            userId: socket.user.id,
                            username,
                            profile_pic: profilePic
                        }
                    );

                } catch (error) {

                    console.error(
                        "Room join socket error:",
                        error
                    );

                    socket.emit("room-error", {
                        message: "Unable to join room."
                    });

                }

            });


            socket.on("disconnect", () => {

                const roomId = socket.roomId;

                if (!roomId) {
                    return;
                }


                const room = rooms.get(roomId);

                if (!room) {
                    return;
                }


                // Host is not part of participants,
                // so only broadcast participant-left
                // for actual participants.
                const participant = room.participants.find(
                    participant =>
                        participant.userId === socket.user.id
                );


                if (!participant) {
                    return;
                }


                console.log(
                    `${participant.username} left room ${roomId}`
                );


                socket.to(roomId).emit(
                    "participant-left",
                    {
                        userId: participant.userId
                    }
                );

            });

            socket.on("leave-room-update", (payload) => {

                const { roomId } = payload;
            
                if (!roomId) {
                    return;
                }
            
                socket.to(roomId).emit("leave-room-update", payload);
            
            });

        } catch (error) {

            console.error(
                "Socket authentication failed:",
                error
            );

            socket.disconnect(true);

        }

    });

}


export default roomSocket;