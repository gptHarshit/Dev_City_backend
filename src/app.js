const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user")
const validator = require('validator');
const cookieParser = require("cookie-parser")

// added a middleware to convert ka client side data from json to javascript obj
app.use(express.json());
// cookie-parser is that which allow the cookies to received from the client side 
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


connectDB()
.then(()=>{
    console.log("database connected successfully");
    app.listen(7777, () => {
        console.log("Server is started successfully");
    });
}).catch(err => {
    console.error("Error, not connected with DB")
})

