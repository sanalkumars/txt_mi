import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server( server ,{
    cors:{
        origin:[ "http://localhost:5173" ],
    }
});
export function getReciverSocketId(userId){
    console.log("usersockets",userSocketMap);
    return userSocketMap[userId];
}


// below variable is for storing the online users
const userSocketMap ={ };

//  here the socket that is got from the callback function is the user that is connected to the server
io.on("connection",(socket) =>{
    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] =socket.id;

    // broad cast the online users to all connected users
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect",() =>{
        console.log("diconnected user" , socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
        
    });
});

export { io , server ,app };
