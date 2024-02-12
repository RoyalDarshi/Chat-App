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
})

setInterval(async ()=>{
        await getMessage(getLastMsgId())
},1000)

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