document.getElementById("sendMsg").addEventListener("click",sendMessage)
async function sendMessage(){
    const message=document.getElementById("msg");
    const data={
        id:localStorage.getItem("userId"),
        message:message.value
    }
    if(data.message.trim()!==""){
        await axios.post(window.location.origin+"/user/send-message",data)
    }
    message.value="";
}