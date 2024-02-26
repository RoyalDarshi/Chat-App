import express from "express";
import bodyParser from "body-parser";
require("dotenv").config();
import cors from "cors";
import Db from "./util/database";
import adminRouter from "./routes/admin";
import User from "./modal/user";
import Message from "./modal/message";
import userRouter from "./routes/user";
import Group from "./modal/group";
import Admin from "./modal/admin";
import User_Group from "./modal/admin";
import {Server} from "socket.io"
import {createServer} from "node:http";

const app=express();

const server=createServer(app)

const io=new Server(server);
io.on("connection",(socket)=>{
    socket.on('send-message', room => {
        io.emit('receive-message', room);
    });
})
app.use(cors({
    origin:"128.0.0.1",

}))
app.use(bodyParser.json());
app.use(express.static("public"))

app.use(adminRouter);

app.use("/user",userRouter)

Message.belongsTo(User,{onDelete:"CASCADE",constraints:true});
User.hasMany(Message);

User.belongsToMany(Group,{through:User_Group});
Group.belongsToMany(User,{through:User_Group});

Message.belongsTo(Group,{onDelete:"CASCADE",constraints:true})
Group.hasMany(Message);

Db.sync({force:false}).then(() =>{
    server.listen(process.env.PORT_NUMBER);
})
