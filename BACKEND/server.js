import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import { connectDB } from "./src/db/db.js";
import http from "http";
import { Server } from "socket.io";
import chatSocket from "./src/socket/chat.socket.js";
import roomSocket from "./src/socket/room.socket.js";
import editorSocket from "./src/socket/editor.socket.js";

connectDB();

const PORT = process.env.PORT || 3000;

// Create the HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

chatSocket(io);
roomSocket(io);
editorSocket(io);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});