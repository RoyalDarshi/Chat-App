import express from "express";
import bodyParser from "body-parser";
require("dotenv").config();
import cors from "cors";
import Db from "./util/database";
import adminRouter from "./routes/admin";
import User from "./modal/user";
import Message from "./modal/message";
import userRouter from "./routes/user";

const app=express();

app.use(cors({
    origin:"128.0.0.1",

}))
app.use(bodyParser.json());
app.use(express.static("public"))

app.use(adminRouter);

app.use("/user",userRouter)

Message.belongsTo(User,{onDelete:"CASCADE",constraints:true});
User.hasMany(Message);

Db.sync({force:false}).then(() =>{
    app.listen(process.env.PORT_NUMBER);
})
