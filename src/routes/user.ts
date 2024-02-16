import {Router} from "express";
import userController from "../controllers/user";

const userRouter=Router()

userRouter.post("/send-message",userController.sendMessage)

userRouter.get("/get-message",userController.getMessage)

userRouter.post("/create-group",userController.createGroup)

userRouter.get("/get-group",userController.getGroups)

userRouter.get("/get-group-msg",userController.getGroupMsg)

userRouter.post("/send-group-msg",userController.sendGroupMessage)

export default userRouter