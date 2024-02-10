import {decode} from "jsonwebtoken";
import Message from "../modal/message";

type sendMessageReq ={
    body:{
        id:string,
        message:string
    }
}
const sendMessage=async (req:sendMessageReq,res:any)=>{
    try {
        const data={
            userId:decode(req.body.id),
            message:req.body.message
        }
        await Message.create(data)
        res.status(201).json({msg:"Message created successfully"})
    }
    catch (e) {
        console.log(e)
    }
}

const userController={
    sendMessage
}

export default userController;