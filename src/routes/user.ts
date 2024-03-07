import {Router} from "express";
import userController from "../controllers/user";
import multer from "multer";

const userRouter=Router()
const storage = multer.memoryStorage()

const upload=multer({storage: storage})

userRouter.post("/send-message",userController.sendMessage)

userRouter.get("/get-message",userController.getMessage)

userRouter.post("/create-group",userController.createGroup)

userRouter.get("/get-group",userController.getGroups)

userRouter.get("/get-group-msg",userController.getGroupMsg)

userRouter.post("/send-group-msg",userController.sendGroupMessage)

userRouter.get("/group-member/:id",userController.getGroupMember)

userRouter.post("/add-user",userController.addUserToGroup)

userRouter.post("/remove-user",userController.removeUserFromGroup)

userRouter.get("/group-admin",userController.isGroupAdmin)

userRouter.post("/make-admin",userController.makeAdmin)

userRouter.post("/remove-admin",userController.removeAdmin)

userRouter.post("/send-image",upload.single("file"),userController.sendImage)

export default userRouter