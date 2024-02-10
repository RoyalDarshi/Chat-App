document.getElementById("signUpPage").addEventListener("click", validateSignUpForm)

async function validateSignUpForm() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const mobile=document.getElementById('phone').value;
    if (fullName.trim() === '' || email.trim() === '' || password.trim() === ''||mobile===0) {
        alert('All fields are required');
    }
    else {
        const data={
            name:fullName,
            email:email,
            mobile:mobile,
            password:password
        }
        const res=await axios.post(window.location.origin+"/create-user",data)
        alert(res.data.msg);
    }
}