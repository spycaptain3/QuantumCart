// Import required files and utilities
const user_login = require("../models/user");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// To access environement variables
require("dotenv").config();
// Create authorisation of email which will send emails to user
let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shopnetauthorisation@gmail.com",
    pass: "yuvyxsnyhiyakuse",
  },
});

module.exports.signup = async (req, res) => {
  try {
    // Checking all details required for signing up is given
   
    if (!req.body.email || !req.body.password || !req.body.name)
      return res
        .status(404)
        .json({ success:-1 ,message: "Enter All credentials properly" });
    //   Existing user check
    const check = await user_login.findOne({ Email: req.body.email });
    // If user already exists,return status 400
    if (check) {
      return res
        .status(400)
        .json({ message: "User Already Exists", success: 0 });
    }
    // Creating an email template with the random otp
    let x = Math.floor(100000 + Math.random() * 900000);
    let VerificationLink = `http://shopnet.onrender.com/verify?email=${req.body.email}&token=${x}`;
    const emailHTML = `
         <html>
         <body>
         <h1>Account Verification</h1>
         <p>Please click the following link to verify your account:</p>
         <a href="${VerificationLink}">Verify Account</a>
         </body>
         </html>
        `;
    // Hashing password before storing
    const hash_pass = await bcrypt.hash(req.body.password, process.env.SALT);
    // Setting expiration time for OTP
    const expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + 600);
    console.log("Content made");
    // Creating a new user
    let resp = await user_login.create({
      Email: req.body.email,
      Name: req.body.name,
      Password: hash_pass,
      EmailToken: x,
      ExpiresAt: expirationTime,
    });

    // Sending Verificaion Email
    let mailDetails = {
      from: "shopnetauthorisation@gmail.com",
      to: req.body.email,
      subject: "Authorization for ShopNet",
      html: emailHTML,
    };
    console.log("Mail Details Made")
    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        console.log("Some error occured",err)
        return res.status(400).json({
          success: -1,
          message: "Email Don't Exist, Enter a Valid Email",
        });
      } else {
        return res.status(200).json({
          otp: x,
          success: 1,
          message: "Authentication mail sent successfully",
        });
      }
    });
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: -1, message: "Email Dont Exist" });
  }
};
module.exports.login = async (req, res) => {
  try {
    // Checking if email & password are specified
    if (!req.body.email || !req.body.password)
      return res.status(404).json({ success: -1, msg: "Bad request" });
    //   Existing user check
    const user = await user_login.findOne({ Email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: 0, message: "NO Such User" });
    }
    // Cheking Password is correct or not
    const compare_pass = await bcrypt.compare(
      req.body.password,
      user.Password
    );
    if (!compare_pass) {
      return res.json({ success: 1, message: "Incorrect PassWord" });
    }
    // Generating Token

    const acesstoken = jwt.sign(
      { email: req.body.email },
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      { expiresIn: "9000s" }
    );
    const refreshtoken = jwt.sign(
      { email: req.body.email },
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    user.RefreshToken = refreshtoken
    await user.save()
    // Setting up  token cookie
    res.cookie("refresh_token", refreshtoken, {
      // secure: true,
      httpOnly: true,
      sameSite: "lax",
    });
    res.cookie("access_token", acesstoken, {
      // secure: true,
      httpOnly: true,
      sameSite: "lax",
    });
    // Returning token
    return res.status(200).json({ success:2,message: "User Logged in succcessfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: 3, message: "Some Error Occured" });
  }
};
module.exports.verify = async (req, res) => {
  try {
    const user = await user_login.findOne({
      Email: req.query.email,
      EmailToken: req.query.token,
    });
    // If its not a valid token,return because we cant verify it
    if (!user || new Date() > user.ExpiresAt)
      return res
        .status(400)
        .json({ message: "Token Expired or not a valid token" });
      
    // Here the token is verified , so check EmailVerified as True and erase the verification token that is generated
    user.EmailToken = null;
    user.IsEmailVerified = true;
    // Creating access and refresh token
    const access_token = await jwt.sign(
      { email: req.query.email },
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      { expiresIn: "9000s" }
    );
    const refresh_token = await jwt.sign(
      { email: req.query.email },
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    user.RefreshToken = refresh_token;
    await user.save();
    res.cookie("refresh_token", refresh_token, {
      // secure: true,
      httpOnly: true,
      sameSite: "lax",
    });
    res.cookie("access_token", access_token, {
      // secure: true,
      httpOnly: true,
      sameSite: "lax",
    });
    return res.render('email_verify')
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: 1, message: "SERVER ERROR OCCURED" });
  }
};
module.exports.resend = async (req, res) => {
  try {
    if (!req.body.email)
      return res.status(404).json({ message: "Email Not Specified" });
    // Checking Account with this email
    const user = await user_login.findOne({ Email: req.body.email });
    if (!user)
      return res
        .status(404)
        .json({ message: "No user with this email exists" });
    if (user.IsEmailVerified)
      return res.status(404).json({ message: "Email Already Verified" });

    // Generating a Random OTP
    let x = Math.floor(100000 + Math.random() * 900000);
    let VerificationLink = `http://localhost:3000/verify?email=${req.body.email}&token=${x}`;
    const emailHTML = `
         <html>
         <body>
         <h1>Account Verification</h1>
         <p>Please click the following link to verify your account:</p>
         <a href="${VerificationLink}">Verify Account</a>
         </body>
         </html>
        `;
    let mailDetails = {
      from: "learnandearn419@gmail.com",
      to: req.body.email,
      subject: "Authorization for ShopNet",
      html: emailHTML,
    };
    const expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + 600);
    user.EmailToken = x;
    user.ExpiresAt = expirationTime;
    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        res.status(400).json({ success: 1, message: "Email Dont Exist" });
      } else {
        res
          .status(200)
          .json({
            otp: x,
            success: 2,
            message: "Verification Link Sent Succesfully",
          });
      }
    });
  } catch (error) {
    res.status(400).json({ success: 1, message: "Server Error" })
  }
};
module.exports.logout = async (req, res) => {
  const refresh_token = req.cookies.refresh_token;
  const access_token = req.cookies.access_token;
  if(access_token)
  res.clearCookie("access_token");
  if(!refresh_token)
  return res.status(404).json({message: "No user is Specified(null refresh token)"})
  const user = await user_login.findOne({ RefreshToken: refresh_token });

  if(!user)
  return res.status(404).json({message : "User Already Logged Out"});
  user.RefreshToken = null
  await user.save()
  res.clearCookie("refresh_token");
  return res.status(200).json({ message: "User Logged out successfully" });
};
module.exports.validate = async(req,res) =>{
  return res.status(200).json({message:"User Validated Successfully",validate : 1})
}
