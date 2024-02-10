import {Router} from "express";

import userController from "../controllers/admin";

const userRouter=Router();

userRouter.get("/",userController.sendSignUpFile)
userRouter.post("/create-user",userController.createUser)

export default userRouter;

