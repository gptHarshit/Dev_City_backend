const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user")

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
    const user = new User(req.body)
    try {
        await user.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(400).send("ERROR saving the user:" + err.message);
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

connectDB()
.then(()=>{
    console.log("database connected successfully");
    app.listen(7777, () => {
        console.log("Server is started successfully");
    });
}).catch(err => {
    console.error("Error, not connected with DB")
})


