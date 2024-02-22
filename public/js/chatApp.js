document.getElementById("sendMsg").addEventListener("click",sendMessage)
async function sendMessage(){
    const message=document.getElementById("msg");
    const data={
        id:localStorage.getItem("userId"),
        message:message.value,
        groupId:localStorage.getItem("groupId")
    }
    if(data.message.trim()!==""){
        const res=await axios.post(window.location.origin+"/user/send-group-msg",data)
    }
    message.value="";
}

document.addEventListener("DOMContentLoaded", async ()=>{
    await createMessage(getLastMsg())
    await getGroup();
})

setInterval(async ()=>{
        await functions()
},1000)
let functions =()=>getMessage(getLastMsgId());

function getLastMsg(){
    return JSON.parse(localStorage.getItem("lastMsg"))||[];
}

function getLastMsgId(){
    const msg=getLastMsg();
    if(msg.length>0){
        return msg[msg.length-1].id;
    }
    return 0;
}
async function getMessage(lastMsgId){
    const id=localStorage.getItem("userId")
    const res=await axios.get(window.location.origin+"/user/get-message?"+"lastMessageId="+lastMsgId+"&&id="+id);
    if(res.data.length>0){
        const msg=[...getLastMsg(),...res.data]
        localStorage.setItem("lastMsg",JSON.stringify(msg.slice(-10)))
        createMessage(res.data)
    }
}

function createMessage(msg){
    const msgContainer=document.getElementById("msgContainer");
    for (const msgElement of msg) {
        const div=document.createElement("div");
        div.innerText=msgElement.message;
        div.className="message sender";
        msgContainer.appendChild(div);
    }
}

document.getElementById("createGroup").addEventListener("click",createGroup);

async function createGroup(){
    const groupName=document.getElementById("groupName");
    const id=localStorage.getItem("userId")
    const data={name:groupName.value,createdBy:id}
    if(groupName.value.trim()!==""){
        const res=await axios.post(window.location.origin+"/user/create-group",data);
        addGroup([res.data.group])
    }
    groupName.value=""
}

async function getGroup(){
    const id=localStorage.getItem("userId");
    const groups=await axios.get(window.location.origin+"/user/get-group?id="+id);
    addGroup(groups.data)
}

function addGroup(groups) {
    const groupContainer = document.getElementById("contactList");

    for (const group of groups) {
        const li=document.createElement("li");
        li.className="list-group-item";
        li.innerHTML=`<a id="group${group.id}" class="btn btn-success w-100 text-lg-start">${group.name}</a>`
        groupContainer.appendChild(li)
        document.getElementById("group"+group.id).addEventListener("click",async ()=>{
            localStorage.setItem("groupId",group.id)
            document.getElementById("chatContainer").classList.remove("visually-hidden")
            document.getElementById("msgSender").classList.remove("visually-hidden")
            functions=()=>getGroupMsg(group.id)
            //await getGroupMsg(group.id)
        } )
    }
}

async function getGroupMsg(id){
    const msg=await axios.get(window.location.origin+"/user/get-group-msg?groupId="+id);
    const msgContainer=document.getElementById("msgContainer")
    msgContainer.innerHTML=""
    createMessage(msg.data)
}

let members;
let admin;

document.getElementById("groupInfo").addEventListener("click",getGroupMember)

async function getGroupMember(){
    const groupId=localStorage.getItem("groupId");
    const userId=localStorage.getItem("userId")
    members= await axios.get(window.location.origin+"/user/group-member/"+groupId)
    admin=await axios.get(window.location.origin+"/user/group-admin?userId="+userId+"&groupId="+groupId)
    members=members.data;
    admin=admin.data
    renderUsers(members);
}

// Render user table
function renderUsers(members) {
    const tBody=document.getElementById("userTableBody")
    tBody.innerHTML=""
    for(const member of members) {
        const tr=document.createElement("tr")
        tr.id="groupMember"+member.id
        tr.innerHTML=`
            <td id="memberName${member.id}">${member.name}</td>
            <td><button id="removeAdmin${member.id}" class="btn btn-danger visually-hidden" onclick=removeMember(${member.id})>Remove</button></td>
            <td><button id="makeAdminBtn${member.id}" class="btn btn-primary visually-hidden" onclick="makeAdmin(${member.id})">Make Admin</button></td>
            <td><button id="adminBtn${member.id}" class="btn btn-success visually-hidden">Admin</button></td>
            <td><button id="removeAdminBtn${member.id}" class="btn btn-success visually-hidden" onclick="removeAdmin(${member.id})">Remove Admin</button></td>
        `
        tBody.appendChild(tr);
        if(member.user_group.isAdmin){
            document.getElementById("adminBtn"+member.id).classList.remove("visually-hidden")
        }
        if(admin.id===member.id){
            document.getElementById("memberName"+member.id).innerText="You";
            document.getElementById("removeAdmin"+member.id).classList.remove("visually-hidden")
        }
        if(admin.isAdmin){
            if(!member.user_group.isAdmin){
                document.getElementById("makeAdminBtn"+member.id).classList.remove("visually-hidden")
            }
            else{
                document.getElementById("removeAdminBtn"+member.id).classList.remove("visually-hidden")
            }
        }
        else{
            document.getElementById("addUser").classList.add("visually-hidden")
        }

    }
}

async function removeMember(userId){
    const data={
        groupId:localStorage.getItem("groupId"),
        userId:userId
    }
    await axios.post(window.location.origin+"/user/remove-user",data);
    const tBody=document.getElementById("userTableBody")
    const member=document.getElementById("groupMember"+userId)
    tBody.removeChild(member)
}

document.getElementById("addUserBtn").addEventListener("click", addUser)

async function addUser(){
    const email=document.getElementById("addUserEmail").value;
    const data={
        email:email,
        groupId:localStorage.getItem("groupId")
    }
    const msg=await axios.post(window.location.origin+"/user/add-user",data)
    alert(msg.data.msg)
}

async function makeAdmin(id){
    const data={userId:id,groupId:localStorage.getItem("groupId")}
    await axios.post(window.location.origin+"/user/make-admin",data)
    document.getElementById("makeAdminBtn"+id).classList.add("visually-hidden")
    document.getElementById("adminBtn"+id).classList.remove("visually-hidden")
    document.getElementById("removeAdminBtn"+id).classList.remove("visually-hidden")
}
async function removeAdmin(id){
    const data={userId:id,groupId:localStorage.getItem("groupId")}
    await axios.post(window.location.origin+"/user/remove-admin",data)
    if(admin.id===id&&admin.isAdmin){
        admin.isAdmin=false;
        window.location.href="/app"
    }else {
        document.getElementById("makeAdminBtn"+id).classList.remove("visually-hidden")
        document.getElementById("adminBtn"+id).classList.add("visually-hidden")
        document.getElementById("removeAdminBtn"+id).classList.add("visually-hidden")
    }
}
