import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";


function chatSocket(io) {

    io.on("connection", (socket) => {

        console.log(
            "Chat socket connected:",
            socket.id
        );


        socket.on("send-message", async (data) => {

            try {

                const { roomId, message } = data;


                if (!roomId || !message?.trim()) {
                    return;
                }


                // Get JWT cookie from Socket.IO handshake
                const cookieHeader =
                    socket.handshake.headers.cookie;

                if (!cookieHeader) {
                    return;
                }


                // Convert cookies into an object
                const cookies = cookieHeader
                    .split(";")
                    .reduce((acc, cookie) => {

                        const [key, value] =
                            cookie.trim().split("=");

                        acc[key] = value;

                        return acc;

                    }, {});


                // Support both 'token' and legacy 'Token' cookie names
                const token = cookies.token || cookies.Token;

                if (!token) {
                    return;
                }


                // Verify JWT
                const decoded = jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );


                // Get the REAL username from PostgreSQL
                const user = await pool.query(
                    `SELECT username
                     FROM user_accs
                     WHERE id = $1`,
                    [decoded.id]
                );


                if (user.rows.length === 0) {
                    return;
                }


                const username =
                    user.rows[0].username;


                // Send the message to everyone
                // currently inside this room
                io.to(roomId).emit(
                    "receive-message",
                    {
                        username,
                        message: message.trim()
                    }
                );


            } catch (error) {

                console.error(
                    "Chat socket error:",
                    error
                );

            }

        });


        socket.on("disconnect", () => {

            console.log(
                "Chat socket disconnected:",
                socket.id
            );

        });

    });

}


export default chatSocket;