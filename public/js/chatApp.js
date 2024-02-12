document.getElementById("sendMsg").addEventListener("click",sendMessage)
async function sendMessage(){
    const message=document.getElementById("msg");
    const data={
        id:localStorage.getItem("userId"),
        message:message.value
    }
    if(data.message.trim()!==""){
        const res=await axios.post(window.location.origin+"/user/send-message",data)
        createMessage([{message:message.value}])
    }
    message.value="";
}

document.addEventListener("DOMContentLoaded", getMessage)

setInterval(getMessage,1000)

async function getMessage(){
    const id=localStorage.getItem("userId")
    const res=await axios.get(window.location.origin+"/user/get-message?id="+id);
    document.getElementById("msgContainer").innerHTML="";
    createMessage(res.data)
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