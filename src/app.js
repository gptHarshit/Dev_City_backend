const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user")
const {ValidateSignUpData} = require("./utlis/validation")
const bcrypt = require("bcrypt");
const validator = require('validator');
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

// added a middleware to convert ka client side data from json to javascript obj
app.use(express.json());
app.use(cookieParser());

// a login of the email and password is done also encryption of the password and checking that user is present or not in db is done here
app.post("/login" , async (req,res) => {
       try {
        const {emailId , password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user) {
            throw new Error("Invalid credential");
        }
        const isPassworValid = await bcrypt.compare( password , user.password);
        if(isPassworValid) {
            // Creating the JWT Tokens ->
            const token = await jwt.sign({_id : user._id} , "DEV@TINDER$790",{expiresIn: "1d"});
            // console.log(token);
            // Add the token with cookies nad send the response back to the token ->  
            res.cookie("token" , token);
            res.send("user login successfull");
        } else {
            throw new Error("Invalid credential");
        }
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

app.get("/profile" ,userAuth, async (req,res) => {

 try { 
    const user = req.user;
    res.send(user);
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
        }
});

app.post("/signup" , async (req,res) => {
 
    console.log(req.body);

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

app.post("/sendConnectionRequest", userAuth, (req,res) => {
        const user = req.user;
        console.log("Connection Request");

        res.send(user.firstName + " is Sending you the conection request");
})

connectDB()
.then(()=>{
    console.log("database connected successfully");
    app.listen(7777, () => {
        console.log("Server is started successfully");
    });
}).catch(err => {
    console.error("Error, not connected with DB")
})


// app.get("/user" , async (req,res) => {
//     const userEmail = req.body.emailId;
//     console.log(userEmail);
//     try {
//         const users = await User.findOne({emailId : userEmail});
//         if(users.length === 0){
//             res.status(404).send("User Not Found");
//         } else {
//             res.send(users);
//         }
//     } catch (err) {
//         res.status(400).send("Something went wrong");
//     }
// })
// // getting all the users that are present in the database , for maintaining feeds in UI
// app.get("/feed" , async (req,res) => {
//     try {
//         const users = await User.find({});
//         res.send(users);

//     } catch (err) {
//         res.status(400).send("ERROR saving the user:" + err.message);
//     }
// })


// // this api delete the data of the user , we are passig the id of the user 
// app.delete("/user" , async (req , res) => {
//     const userId = req.body.userId;
//     console.log(userId);
//     try {
//         const user =  await User.findByIdAndDelete(userId);
//         res.send("deleted Successfully")
//     } catch (err) {
//         res.status(400).send("ERROR saving the user:" + err.message);
//     }
// })

// /**
//  * here by using the patch we are udating the use details also req gives the id of the user ehich we have to update 
//  * ans req.boy give the content that hqas to be updated in the DB if we console log data  we will get same data that we are trying to update 
//  */

// app.patch("/user/:userId" , async (req,res) => {
//     const userId = req.params?.userId;
//     const data = req.body;
  
//     try {
//         ALLOWED_UPDATES = [ "firstname" , "lastName" , "skills" ,'age' , "gender"];

//         const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
    
//         if(!isUpdateAllowed){
//             throw new Error("Updated is not allowed");
//         }
        
//         if(data?.skills.length > 10) {
//             throw new Error("Skills cannot be greater then 8");
//         }

//         const user = await User.findByIdAndUpdate({_id : userId} , data,  {
//             returnDocument : "after",
//             runValidators : true,
//         });
//         res.send("User data Updated successfully");
//     } catch (err) {
//         res.status(400).send("ERROR saving the user:" + err.message);
//     }
  
// })