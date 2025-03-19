const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user")
const {ValidateSignUpData} = require("./utlis/validation")
const bcrypt = require("bcrypt");

// added a middleware to convert ka client side data from json to javascript obj
app.use(express.json());

/**
 * yaha pr get api bana rhe hai , agr samne se kisi user ne email daal diya to vo email req me aayega vaha se hm us email ko nikal lenge
 *     const userEmail = req.body.emailId;   jo user ne dala tha fir hm User.find methos ka use krke apne DB me dekhenge ki kya user present hai 
 * or us user ki detail send kr denge 
 */
app.get("/user" , async (req,res) => {
    const userEmail = req.body.emailId;
    console.log(userEmail);
    try {
        const users = await User.findOne({emailId : userEmail});
        if(users.length === 0){
            res.status(404).send("User Not Found");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
})

/**
 * yaha jb ek new user aayega or vo signup karega to apna data dalega signup page me or fir vaha se vo req me aayega
 * req ke badha obj hai isliye hm req.body krke user ne jo data dala hai vo hme mil jayega usi data ko use krke jo hme 
 * schema banaya hai us Model(User) ka instance create kr denge or hmne DB me save kr denge ashe hamare db me ek naya user add ho jayega 
 */
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

// getting all the users that are present in the database , for maintaining feeds in UI
app.get("/feed" , async (req,res) => {
    try {
        const users = await User.find({});
        res.send(users);

    } catch (err) {
        res.status(400).send("ERROR saving the user:" + err.message);
    }
})


// this api delete the data of the user , we are passig the id of the user 
app.delete("/user" , async (req , res) => {
    const userId = req.body.userId;
    console.log(userId);
    try {
        const user =  await User.findByIdAndDelete(userId);
        res.send("deleted Successfully")
    } catch (err) {
        res.status(400).send("ERROR saving the user:" + err.message);
    }
})

/**
 * here by using the patch we are udating the use details also req gives the id of the user ehich we have to update 
 * ans req.boy give the content that hqas to be updated in the DB if we console log data  we will get same data that we are trying to update 
 */

app.patch("/user/:userId" , async (req,res) => {
    const userId = req.params?.userId;
    const data = req.body;
  
    try {
        ALLOWED_UPDATES = [ "firstname" , "lastName" , "skills" ,'age' , "gender"];

        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
    
        if(!isUpdateAllowed){
            throw new Error("Updated is not allowed");
        }
        
        if(data?.skills.length > 10) {
            throw new Error("Skills cannot be greater then 8");
        }

        const user = await User.findByIdAndUpdate({_id : userId} , data,  {
            returnDocument : "after",
            runValidators : true,
        });
        res.send("User data Updated successfully");
    } catch (err) {
        res.status(400).send("ERROR saving the user:" + err.message);
    }
  
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


