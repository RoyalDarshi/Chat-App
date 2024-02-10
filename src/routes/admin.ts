import {Router} from "express";

import adminController from "../controllers/admin";

const adminRouter=Router();

adminRouter.get("/",adminController.sendSignUpPage)

adminRouter.get("/login",adminController.sendLoginPage)

adminRouter.get("/app",adminController.sendChatAppPage)

adminRouter.post("/create-user",adminController.createUser)

adminRouter.post("/login-user",adminController.loginUser)

export default adminRouter;

