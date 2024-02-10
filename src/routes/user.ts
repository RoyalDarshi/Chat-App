import {Router} from "express";

import userController from "../controllers/admin";

const userRouter=Router();

userRouter.get("/",userController.sendSignUpPage)

userRouter.get("/login",userController.sendLoginPage)

userRouter.post("/create-user",userController.createUser)

export default userRouter;

