// Importing postdata from fetch api
import { postData } from "./fetch_api.js";
// Variable to store otp
let sent_otp;
// Function to validate email
function ValidateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
}
var interval;
// Listner when user logins
export async function login_listner() {
  let data = {
    email: document.getElementById("login_email_id").value,
    password: document.getElementById("login_password").value,
  };
  if (data.email == "" && data.password == "") {
    document.getElementById("login_email_error").innerText =
      "*Please Enter Email";
    document.getElementById("login_pass_error").innerText =
      "*Please Enter PassWord";
    document.getElementById("login_credentials_error").innerText = "";
    return;
  } else if (data.email == "") {
    document.getElementById("login_email_error").innerText =
      "*Please Enter Email";
    document.getElementById("login_password").value = "";
    document.getElementById("login_pass_error").innerText = "";
    document.getElementById("login_credentials_error").innerText = "";
    return;
  } else if (data.password == "") {
    document.getElementById("login_email_error").innerText = "";
    ocument.getElementById("login_credentials_error").innerText = "";
    document.getElementById("login_pass_error").innerText =
      "*Please Enter Password";
    return;
  } else {
    document.getElementById("login_email_error").innerText = "";
    document.getElementById("login_pass_error").innerText = "";
    if (!ValidateEmail(data.email)) {
      document.getElementById("login_email_error").innerText =
        "*Not a Valid Email";
      return;
    } else {
      document.getElementById("load1").style.display = "block";
      let resp = await postData("/login", data);
      document.getElementById("load1").style.display = "none";
      // console.log(resp)
      if (resp.success == -1) {
        document.getElementById("login_credentials_error").innerText =
          "*Valid Credentials Not Provided";
        return;
      } else if (resp.success == 0) {
        document.getElementById("login_credentials_error").innerText =
          "*No user with this email exist";
        return;
      } else if (resp.success == 1) {
        document.getElementById("login_credentials_error").innerText =
          "*PassWord Incorrect";
        return;
      } else if (resp.success == 3) {
        document.getElementById("login_credentials_error").innerText =
          "Email Incorrect";
        return;
      } else {
        location.href = "/";
      }
    }
  }
}
// Listner when user signups
export async function signup_listner() {
  let data = {
    name: document.getElementById("signup_name").value,
    email: document.getElementById("signup_email").value,
    password: document.getElementById("signup_pass").value,
  };
  if (data.email == "" && data.name == "" && data.password == "") {
    document.getElementById("signup_credentials_error").innerText =""
    document.getElementById("signup_email_error").innerText =
      "*Please Enter Email";
    document.getElementById("signup_name_error").innerText =
      "*Please Enter Name";
    document.getElementById("signup_pass_error").innerText =
      "*Please Enter Password";
    return;
  } else if (data.email == "" && data.name == "") {
    document.getElementById("signup_email_error").innerText =
      "*Please Enter Email";
    document.getElementById("signup_name_error").innerText =
      "*Please Enter Name";
    document.getElementById("signup_pass_error").innerText = "";
    document.getElementById("signup_credentials_error").innerText =""
    return;
  } else if (data.email == "" && data.password == "") {
    document.getElementById("signup_email_error").innerText =
      "*Please Enter Email";
    document.getElementById("signup_name_error").innerText = "";
    document.getElementById("signup_pass_error").innerText =
      "*Please Enter Password";
      document.getElementById("signup_credentials_error").innerText =""
    return;
  } else if (data.password == "" && data.name == "") {
    document.getElementById("signup_email_error").innerText = "";
    document.getElementById("signup_name_error").innerText =
      "*Please Enter Name";
    document.getElementById("signup_pass_error").innerText =
      "*Please Enter Password";
    return;
  } else if (data.password == "") {
    document.getElementById("signup_email_error").innerText = "";
    document.getElementById("signup_name_error").innerText = "";
    document.getElementById("signup_pass_error").innerText =
      "*Please Enter Password";
      document.getElementById("signup_credentials_error").innerText =""
    return;
  } else if (data.name == "") {
    document.getElementById("signup_email_error").innerText = "";
    document.getElementById("signup_name_error").innerText =
      "*Please Enter Name";
    document.getElementById("signup_pass_error").innerText = "";
    document.getElementById("signup_credentials_error").innerText =""
    return;
  } else if (data.email == "") {
    document.getElementById("signup_email_error").innerText =
      "*Please Enter Email";
    document.getElementById("signup_name_error").innerText = "";
    document.getElementById("signup_pass_error").innerText = "";
    document.getElementById("signup_credentials_error").innerText =""
    return;
  } else {
    if (!ValidateEmail(data.email)) {
      document.getElementById("signup_email_error").innerText =
        "*Not a Valid Email";
      document.getElementById("signup_pass_error").innerText = "";
      document.getElementById("signup_name_error").innerText = "";
      document.getElementById("signup_credentials_error").innerText =""
      return;
    } else {
      document.getElementById("load2").style.display = "block";
      let res = await postData("/signup", data);
      document.getElementById("load2").style.display = "none";
      document.getElementById("signup_pass_error").innerText = "";
      document.getElementById("signup_name_error").innerText = "";
      document.getElementById("signup_email_error").innerText = "";
      if (res.success == 0) {

        document.getElementById("signup_credentials_error").innerText =
          "*User Already Exists";
        return;
      } else if (res.success == -1) {
        document.getElementById("signup_credentials_error").innerText =
          "*Some Error Occured, Check Your Credentials";
        return;
      } else if (res.success == 1) {
        document.getElementById("signup_pass_error").innerText = "";
        document.getElementById("signup_name_error").innerText = "";
        document.getElementById("signup_email_error").innerText = "";
        document.getElementById("signup_credentials_error").innerText =
          "An email has been sent to your mail with verification mail, It will be valid for 10 min only";
          document.getElementById("signup_credentials_error").style.color = "green"
      }
    }
  }
}
// Listner when user asks to resend otp
export async function resend_listner() {
  console.log("Inside resent");
  document.getElementById("load3").style.display = "block";
  let result = await postData("/resend", {
    email: document.getElementById("signup_email").value,
  });
  document.getElementById("load3").style.display = "none";
  if (result.success == 1) {
    document.getElementById("otp_valid_error").innerText =
      "Internal Server Error";
  } else {
    sent_otp = result.otp;
    setTimeout(() => {
      sent_otp = 0;
    }, 120000);
    document.getElementById("verify_time").innerHTML = "2:00";
    countdown();

    document.getElementById("otp_valid_error").innerText =
      "OTP Sent Successfully";
  }
}

// Function to validate active user session

export async function validate_user(){
  const result = await postData('/validate' ,{})
  if(result.validate == 1){
  document.querySelector('body').innerHTML = "User is already authenticated,Can not login"
  }
}
