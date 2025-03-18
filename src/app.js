const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user")

// added a middleware to convert ka client side data from json to javascript obj
app.use(express.json());

app.post("/signup" , async (req,res) => {

    const user = new User(req.body)
      
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


