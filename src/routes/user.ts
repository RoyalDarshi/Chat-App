import {Router} from "express";
import userController from "../controllers/user";

const userRouter=Router()

userRouter.post("/send-message",userController.sendMessage)

export default userRouter