import User from "../modal/user";
import bcrypt from "bcrypt"
import path from "node:path";

const sendSignUpPage=(req:any, res:any)=>{
    res.status(201).sendFile(path.join(process.cwd(),"views","index.html"))
}

const sendLoginPage=(req:any,res:any)=>{
    res.status(201).sendFile(path.join(process.cwd(),"views","login.html"))
}

type userReq={
    body:{
        name:string,
        email:string,
        mobile:number,
        password:string

    }
}
const createUser=(req:userReq,res:any)=>{
    bcrypt.hash(req.body.password,10,async (err,password)=>{
        const data={
            name:req.body.name,
            email:req.body.email,
            mobile: req.body.mobile,
            password:password
        }
        const userExist=await User.findOne({where:{
            email:data.email
        }})
        if(userExist){
            return res.status(201).json({msg:"User already exist!"})
        }
        await User.create(data);
        res.status(201).json({msg:"User created successfully"});
    })
}
const userController={
    createUser,
    sendSignUpPage,
    sendLoginPage
}
export default userController;