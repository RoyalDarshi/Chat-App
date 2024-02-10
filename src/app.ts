import express from "express";
import bodyParser from "body-parser";
require("dotenv").config();
import Db from "./util/database";
import userRouter from "./routes/user";

const app=express();


app.use(bodyParser.json());
app.use(express.static("public"))

app.use(userRouter);
Db.sync({force:false}).then(() =>{
    app.listen(process.env.PORT_NUMBER);
})
