import express from 'express';
import dotenv from "dotenv";
import cookieParser  from "cookie-parser";
import cors from "cors";
import path from 'path';


// router for different route files
import authRouter from "./routes/authRoute.js"
import messageRouter from "./routes/messageRoute.js"
import { connectDB } from './lib/db.js';
import { app , server , io} from './lib/socket.js';



dotenv.config();

const __dirname = path.resolve();

const port = process.env.PORT || 5001;

// configuring the basic packages
app.use(express.json()); //this is for parsing the json data for the request body
app.use(cookieParser()); //this is for parsing the cookie(like jwt token from the cookie)

// the below is for letting the frontend(react app) to send request to the backend to access the resource
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))

app.use("/api/auth",authRouter);
app.use("/api/messages",messageRouter);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    })
}


server.listen(port,()=>{
    console.log(`server is running at  ${port}`);
    connectDB();
});