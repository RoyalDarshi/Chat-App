import {decode} from "jsonwebtoken";
import Message from "../modal/message";
import {Op} from "sequelize";
import User from "../modal/user";
import Group from "../modal/group";

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
        id:string,
        lastMessageId:number
    }
}
const getMessage=async (req:getMessageReq,res:any)=>{
    try {
        const id=decode(req.query.id);
        const data=await Message.findAll({where:
                {userId:id,id:{
                    [Op.gt]:req.query.lastMessageId
                    }}});
        res.status(201).json(data)
    }
    catch (e) {
        console.error(e)
    }
}

type createGroupReq={
    body:{
        name:string,
        createdBy:string,
    }
}
const createGroup=async (req:createGroupReq,res:any)=>{
    try{
        const userId=decode(req.body.createdBy);
        const name=req.body.name;
        const user=await User.findOne({where:{id:userId}});
        const group=await Group.create({name:name,createdBy:userId},{include:User});
        // @ts-ignore
        group.addUser(user)
        res.status(201).json({msg:"Group created successfully",group:group});
    }
    catch (e) {
        console.error(e)
    }
}

type getGroupsReq={
    query:{
        id:string
    }
}
const getGroups=async (req:getGroupsReq,res:any)=>{
   try{
       const id=decode(req.query.id);
       const user=await User.findOne({where:{id:id},include:Group});
       // @ts-ignore
       res.status(201).json(user.groups);
   }
   catch (e) {
       console.error(e)
   }
}

type groupMsgReq={
    query:{
        groupId:number
    }
}
const getGroupMsg=async (req:groupMsgReq,res:any)=>{
    const groupId=req.query.groupId;
    const group=await Group.findOne({where:{id:groupId},include:Message})
    //@ts-ignore
    res.status(201).json(group.messages)
}
type sendGroupMessageReq={
    body:{
        userId:string,
        groupId:number,
        message:string
    }
}
const sendGroupMessage = async (req:sendGroupMessageReq,res:any)=>{
    const data={
        userId:decode(req.body.userId),
        groupId:req.body.groupId,
        message: req.body.message
    }
    const msg=await Message.create(data);
    res.status(201).json({msg:"message sent successfully",data:msg})
}

const userController={
    sendMessage,
    getMessage,
    createGroup,
    getGroups,
    getGroupMsg,
    sendGroupMessage
}

export default userController;