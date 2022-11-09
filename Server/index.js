import express from "express";
import morgan from "morgan";
import { Server as SocketServer} from "socket.io";
import http from "http";
import cors from "cors";
import { PORT } from "./config.js";

const app = express();
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

server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
