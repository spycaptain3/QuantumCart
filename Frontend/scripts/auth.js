import {  login_listner, resend_listner, signup_listner, validate_user} from '../frontend_utils/login_script.js'

validate_user()



// When user enter credentials and click on login btn for verifying
document.getElementById('login').addEventListener('click', login_listner)
// When user enter credentials and click on signup btn for verifying
document.getElementById('signup').addEventListener('click', signup_listner)


let signup = document.querySelector(".signup-slider");
let login = document.querySelector(".login-slider");
let slider = document.querySelector(".slider");
let formSection = document.querySelector(".form-section")
 
signup.addEventListener("click", () => {
    slider.classList.add("moveslider");
    formSection.classList.add("form-section-move");
});
 
login.addEventListener("click", () => {
    slider.classList.remove("moveslider");
    formSection.classList.remove("form-section-move");
});