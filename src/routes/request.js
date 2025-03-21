const express = require("express") 
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, (req,res) => {
    const user = req.user;
    console.log("Connection Request");

    res.send(user.firstName + " is Sending you the conection request");
})

module.exports = requestRouter;