const express  = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {validateEditProfileData , validateUpdatedPassword } = require("../utlis/validation");
const bcrypt = require("bcrypt");


profileRouter.get("/profile/view" ,userAuth, async (req,res) => {
    try { 
       const user = req.user;
       res.send(user);
       } catch (err) {
           res.status(400).send("ERROR : " + err.message);
           }
});
   
profileRouter.patch("/profile/edit" ,userAuth, async (req,res) => {
    console.log(req.body);
    try {
    const test = validateEditProfileData(req);
    if(!test){
        throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    console.log(loggedInUser);
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    console.log(loggedInUser);
    res.send(` ${loggedInUser.firstName},  your profile updated successfully`);
    } catch (err) {
        res.status(400).send( " ERROR : " + err.message)
    }
})

profileRouter.patch("/profile/password" ,userAuth, async (req,res) => {
     try  { 
       const {password} = req.body;
       console.log(password);
       validateUpdatedPassword(req);
       console.log( "After validation : " + password)
       const user  = req.user;
       console.log("Before Hasing : " + user.password); 
       const passwordHashUpdated = await bcrypt.hash(password,10);
       console.log("After Hashing : " + passwordHashUpdated);
       user.password = passwordHashUpdated;
       await user.save();
       res.clearCookie("token");
       res.send("password Saved successfully")
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

module.exports = profileRouter;
