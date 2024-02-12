import {Router} from "express";
import userController from "../controllers/user";

const userRouter=Router()

userRouter.post("/send-message",userController.sendMessage)

userRouter.get("/get-message",userController.getMessage)

export default userRouter