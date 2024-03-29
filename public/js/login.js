document.getElementById("loginPage").addEventListener("click", validateForm)
async function validateForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email.trim() === '' || password.trim() === '') {
        alert('Please enter both email and password');
    }
    else {
        const data={
            email:email,
            password:password
        }
        const res=await axios.post(window.location.origin+"/login-user",data);
        alert(res.data.msg)
        if(res.data.token){
            localStorage.setItem("userId",res.data.token)
            const msg=await axios.get(window.location.origin+"/user/get-message?"+"lastMessageId=0&&id="+res.data.token);
            window.location.href="/app"
            localStorage.setItem("lastMsg",JSON.stringify(msg.data))
        }
    }

}