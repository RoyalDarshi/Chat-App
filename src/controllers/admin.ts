import User from "../modal/user";
import bcrypt from "bcrypt"
import path from "node:path";
import {decode, sign} from "jsonwebtoken"

function createToken(id:string){
    return sign(id, process.env.JWT_SECRET_KEY!);
}

function decodeToken(token:string){
    return decode(token);
}

const sendSignUpPage=(req:any, res:any)=>{
    res.status(201).sendFile(path.join(process.cwd(),"views","index.html"))
}

const sendLoginPage=(req:any,res:any)=>{
    res.status(201).sendFile(path.join(process.cwd(),"views","login.html"))
}

type createUserReq={
    body:{
        name:string,
        email:string,
        mobile:number,
        password:string

    }
}
const createUser=(req:createUserReq,res:any)=>{
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

type loginUserReq = {
    body:{
        email:string,
        password:string
    }
}
const loginUser=async (req:loginUserReq,res:any)=> {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    })
    if (!user) {
        return res.status(404).json({msg: "User doesn't Exist"})
    }
    const isRightPass = await bcrypt.compare(req.body.password, user.dataValues.password)
    let msg: string
    const token=createToken(user.dataValues.id+"");
    if (isRightPass) {
        msg = "User logged in successfully"
        return res.status(201).json({msg:msg,token:token})
    } else {
        msg = "Wrong password!"
        res.status(401).json({msg:msg})
    }

}

const userController={
    createUser,
    sendSignUpPage,
    sendLoginPage,
    loginUser
}
export default userController;