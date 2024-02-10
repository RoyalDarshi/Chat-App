import {Router} from "express";

import userController from "../controllers/admin";

const userRouter=Router();

userRouter.get("/",userController.sendSignUpPage)

userRouter.get("/login",userController.sendLoginPage)

userRouter.post("/create-user",userController.createUser)

userRouter.post("/login-user",userController.loginUser)

export default userRouter;

