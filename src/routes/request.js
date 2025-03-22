const express = require("express") 
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")

requestRouter.post("/request/send/:status/:touserId", userAuth, async (req,res) => {
 
   try {  
    
    const fromUserId = req.user;
    const toUserId = req.params.touserId;
    const status = req.params.status;

    const allowedStatus = ["interested", "ignored"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({message : "Invalid status type" + status});
    }
    const toUser = await User.findById(toUserId);
    if(!toUser) {
        return res.status(404).json({message : "User not Found"});
    }

    const existingConnectionRequested = await ConnectionRequest.findOne({
        $or: [
            {fromUserId,toUserId},
            {fromUserId : toUserId , toUserId : fromUserId}
        ]
    });

    if(existingConnectionRequested) {
        return res.status(400).json({message : "Connection Requested Already Sent"});
    }
    
    const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
    });

    const data = await connectionRequest.save();

    res.json({
        message: req.user.firstName + " is " + status + " in " + toUser.firstName, 
        data
    })

    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId" , userAuth , async (req,res) => {
    try {
        const loggedInUser = req.user;
        const {status , requestId} = req.params;

        const allowedStatus = [ "accepted" , "rejected" ]
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message : "Invalid status type"});
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : "interested",
        })
        if(!connectionRequest) {
           return res.status(404).json({ message : "Connection request not found"});
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();
        console.log(data);

        res.json({ message : "Connection Request " + status , data});

    } catch(err) {
        return res.status(400).send("Error : " + err.message);
    }
})

module.exports = requestRouter;