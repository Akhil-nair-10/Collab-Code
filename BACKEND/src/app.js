import express from "express";
import roomRoutes from "./routes/room.routes.js";
import compilerRoutes from "./routes/compiler.routes.js";
import authRoutes from "./routes/auth.routes.js"
import cors from "cors";
import cookieParser from "cookie-parser"

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true               //without this browser refuses to store cookies 
    })
);

app.use(express.json());

app.use("/room", roomRoutes);
app.use("/compiler", compilerRoutes);
app.use("/auth", authRoutes);

export default app;