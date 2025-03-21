const express = require("express")
const User = require("../models/user")
const {ValidateSignUpData} = require("../utlis/validation")
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

const authRouter  = express.Router();

authRouter.post("/login" , async (req,res) => {
    try {
     const {emailId , password} = req.body;
     const user = await User.findOne({emailId: emailId});
     if(!user) {
         throw new Error("Invalid credential");
     }
     const isPassworValid = await user.validatePassword(password);
     if(isPassworValid) {
         const token = await user.getJWT();   
         res.cookie("token" , token);
         res.send("user login successfull");
     } else {
         throw new Error("Invalid credential");
     }
 } catch (err) {
     res.status(400).send("ERROR : " + err.message);
 }
});


authRouter.post("/signup" , async (req,res) => {
    try {
        // validating the data
       ValidateSignUpData(req);  
       // Encrypting the password: 
       const { firstName ,lastName , emailId , password} = req.body
       const passwordHash =  await bcrypt.hash(password,10);
       console.log(passwordHash);
        // creating a new instance of the user model
       const user = new User({
                firstName , lastName , emailId ,password : passwordHash
       });
        await user.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

authRouter.post("/logout" , async (req,res)=> {
    res.cookie("token" , null , {
        expires: new Date(Date.now()),
    });
    res.send("Logout");
});

module.exports = authRouter;