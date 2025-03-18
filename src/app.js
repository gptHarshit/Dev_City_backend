const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user")

app.post("/signup" , async (req,res) => {
    const userObj = {
        firstName : "Harshit",
        lastName : "Gupta",
        emailId : "harshitgpt21@gmail.com",
        password : "harshit@123"
    }

    const user = new User(userObj);
    try {
        await user.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(400).send("ERROR saving the user:" + err.message);
    }
    
});

connectDB()
.then(()=>{
    console.log("database connected successfully");
    app.listen(7777, () => {
        console.log("Server is started successfully");
    });
}).catch(err => {
    console.error("Error, not connected with DB")
})


