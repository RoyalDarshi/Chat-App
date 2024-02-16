document.getElementById("sendMsg").addEventListener("click",sendMessage)
async function sendMessage(){
    const message=document.getElementById("msg");
    const data={
        id:localStorage.getItem("userId"),
        message:message.value
    }
    if(data.message.trim()!==""){
        const res=await axios.post(window.location.origin+"/user/send-message",data)
    }
    message.value="";
}

document.addEventListener("DOMContentLoaded", async ()=>{
    await createMessage(getLastMsg())
    await getGroup();
})

setInterval(async ()=>{
        await functions[0]()
},1000)
const functions =[()=>getMessage(getLastMsgId())];

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
        document.getElementById("group"+group.id).addEventListener("click",()=>getGroupMsg(group.id) )
    }
}

async function getGroupMsg(id){
    const msg=await axios.get(window.location.origin+"/user/get-group-msg?groupId="+id);
    const msgContainer=document.getElementById("msgContainer")
    msgContainer.innerHTML=""
    createMessage(msg.data)
}

