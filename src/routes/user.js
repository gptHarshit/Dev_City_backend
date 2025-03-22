const express = require("express") 
const { userAuth } = require("../middlewares/auth");
const  ConnectionRequest  = require("../models/connectionRequest");
const authRouter = require("./auth");
const userRouter = express.Router();
const User = require("../models/user");

const USER_SAVE_DATA = "firstName lastName photoUrl age  skils  gender about";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try { 
        const loggedInUser = req.user;
        if (!loggedInUser) {
            return res.status(404).json({ message: "Unauthorized user" });
        }
        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status: "interested",
        }).populate( "fromUserId" , ["firstName" , "lastName", "photoUrl" , "age" , "gender" , "about"]);
        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        });       
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/connections" , userAuth , async (req,res) => {
    try {

        loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or : [
                {toUserId : loggedInUser._id , status: "accepted"},
                {fromUserId : loggedInUser._id , status: "accepted"}
            ],
        }).populate( "fromUserId" , ["firstName" , "lastName", "photoUrl" , "age" , "gender" , "about"])
        .populate( "toUserId" , ["firstName" , "lastName", "photoUrl" , "age" , "gender" , "about"]);

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
              return  row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({ data})


    } catch (err) {
        res.status(400).send({message : err.message} );
    }
});

userRouter.get("/feed" , userAuth , async ( req , res) => {

    try {
        const loggedInUser = req.user;
        
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = ( page - 1 ) * limit;
        limit = limit > 50 ? 50 : limit;

        const connectionRequests = await ConnectionRequest.find({
            $or : [
                {fromUserId: loggedInUser._id},
                {toUserId : loggedInUser._id}
            ],
        }).select("fromUserId toUserId")

        const hideUserFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
        $and: [
           { _id : {$nin: Array.from(hideUserFromFeed)}},
           { _id : {$ne : loggedInUser._id}}
        ],
        }).select(USER_SAVE_DATA).skip(skip).limit(limit);
        // console.log(users);

        res.send(users);

    } catch (err) {
        res.status(400).send({message : err.message});
    }

});

module.exports = userRouter;