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
        console.error(e)
    }
}
type getMessageReq={
    query:{
        id:string
    }
}
const getMessage=async (req:getMessageReq,res:any)=>{
    try {
        const id=decode(req.query.id);
        const data=await Message.findAll({where:{userId:id}});
        res.status(201).json(data)
    }
    catch (e) {
        console.error(e)
    }
}

const userController={
    sendMessage,
    getMessage
}

export default userController;