import {decode} from "jsonwebtoken";
import Message from "../modal/message";
import {Op} from "sequelize";
import User from "../modal/user";
import Group from "../modal/group";
import Admin from "../modal/admin";
import User_Group from "../modal/admin";
import {S3} from "aws-sdk"
import * as fs from "fs";

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
        //@ts-ignore
        group.addUser(user,{through:{isAdmin: true}})
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
        groupId:number,
        lastMsgId:number
    }
}
const getGroupMsg=async (req:groupMsgReq,res:any)=>{
    const groupId=req.query.groupId;
    const msg=await Message.findAll({
        where: { groupId: groupId }, // Filter by group ID
        include: [{
            model: User, // Include the User model
            attributes: ['name'] // Specify which user attributes you want to retrieve
        }]
    })
    //const group=await Group.findOne({where:{id:groupId},include:Message})
    //@ts-ignore
    res.status(201).json(msg)
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
    console.log(data)
    const msg=await Message.create(data);
    res.status(201).json({msg:"message sent successfully",data:msg})
}

type getGroupMemberReq={
    params:{
        id:number
    }
}
const getGroupMember= async (req:getGroupMemberReq,res:any)=>{
    try{
        const groupId=req.params.id;
        const group=await Group.findOne({where:{id:groupId},include:User});
        //@ts-ignore
        res.status(201).json(group.users)
    }catch (e) {
        console.error(e)
        res.status(500).json({msg:"Some error occur in fetching group member"})
    }
}

type addUserToGroupReq={
    body:{
        email:string,
        groupId:number
    }
}
const addUserToGroup=async (req:addUserToGroupReq,res:any)=>{
    try {
        const user=await User.findOne({where:{email:req.body.email}});
        const group=await Group.findOne({where:{id:req.body.groupId},include:User});
        //@ts-ignore
        await group.addUser(user,{through:{isAdmin: false}})
        res.status(201).json({msg:"user added to group successfully"});
    }catch (e) {
        console.error(e)
        res.status(500).json({msg:"Some error occur in adding group member"})
    }
}
type removeUserFromGroupReq={
    body:{
        groupId:number,
        userId:number
    }
}
const removeUserFromGroup=async (req:removeUserFromGroupReq,res:any)=>{
    try {
        const user=await User.findOne({where:{id:req.body.userId}});
        const group=await Group.findOne({where:{id:req.body.groupId},include:User});
        //@ts-ignore
        await group.removeUser(user)
        res.status(201).json(group?.dataValues.users);
    }catch (e) {
        console.error(e)
        res.status(500).json({msg:"Some error occur in removing group member"})
    }
}

type isGroupAdminReq={
    query:{
        userId:string,
        groupId:number
    }
}
const isGroupAdmin=async (req:isGroupAdminReq,res:any)=>{
    try {
        // @ts-ignore
        const userId=+decode(req.query.userId)
        const user=await User_Group.findOne({where:{userId:userId,groupId:req.query.groupId}})
        res.status(201).json({id:userId,isAdmin:user?.dataValues.isAdmin})
    }
    catch (e) {
        console.error(e)
        res.status(501).json({msg:"Something went wrong while fetching group admin!"})
    }
}

type makeAdminReq={
    body:{
        userId:number,
        groupId:number
    }
}
const makeAdmin=async (req:makeAdminReq,res:any)=>{
    try {
        const user = await User_Group.findOne({
            where: {
                UserId: req.body.userId,
                GroupId: req.body.groupId
            }
        });
        // @ts-ignore
        user.isAdmin=true;
        const result=await user?.save();
        res.status(201).json(result)
    }
    catch (e) {
        console.error(e)
        res.status(501).json({msg:"Something went wrong making user group admin!"})
    }
}

const removeAdmin=async (req:makeAdminReq,res:any)=>{
    try {
        const user = await User_Group.findOne({
            where: {
                UserId: req.body.userId,
                GroupId: req.body.groupId
            }
        });
        // @ts-ignore
        user.isAdmin=false;
        const result=await user?.save();
        res.status(201).json(result)
    }
    catch (e) {
        console.error(e)
        res.status(501).json({msg:"Something went wrong removing user from group admin!"})
    }
}
type sendImageReq={
    body:{
        userId:string,
        groupId:number
    },
    file:any,
    params:any
}
const sendImage=(req:sendImageReq,res:any)=>{
    const userId=decode(req.body.userId);
    const groupId=req.body.groupId
    const s3=new S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET_KEY
    })
    const uploadParams = {
        Bucket: process.env.BUCKET_NAME!,
        Key: `image${groupId}-${new Date()}.jpg`,
        Body: req.file.buffer
    };

// Upload image to S3
    s3.upload(uploadParams, async (err:any, data:any) => {
        if (err) {
            console.log(err)
            res.status(500).json({err:"something went wrong"})
        } else {
            console.log(data)
           const msg= await Message.create({link:data.Location,userId:userId,groupId:groupId})
            console.log(msg)
            res.status(201).json({msg:"Image uploaded successfully. Image URL:",url:data.Location})
        }
    });
}

const userController={
    sendMessage,
    getMessage,
    createGroup,
    getGroups,
    getGroupMsg,
    sendGroupMessage,
    getGroupMember,
    addUserToGroup,
    removeUserFromGroup,
    isGroupAdmin,
    makeAdmin,
    removeAdmin,
    sendImage
}

export default userController;