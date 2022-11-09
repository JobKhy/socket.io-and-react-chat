import express from "express";
import morgan from "morgan";
import { Server as SocketServer} from "socket.io";
import http from "http";
import cors from "cors";
import { PORT } from "./config.js";
import {dirname, join } from "path";
import {fileURLToPath} from "url";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: "http://localhost:5173",
    }
});

app.use(morgan("dev"));

io.on("connection", (socket) => {
    // console.log("New client connected");

    socket.on("message", (message, username) => {
        // console.log( username, ": ", message );
        socket.broadcast.emit("message", {
            body: message,
            from: username,
            clas: 'message',
        });
    });

    // socket.on("disconnect", () => {
    //     console.log("Client disconnected");
    // });
});

app.use(express.static(join(__dirname, "../client/dist")));

server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
