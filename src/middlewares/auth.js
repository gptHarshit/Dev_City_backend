const Adminauth = (req,res,next) => {
    console.log("Admin authentication Process Done")
    const token = "xyz";
    const isAdminAuthorised = token === "xyz";
    if(!isAdminAuthorised){
        res.status(401).send("Admin is not authorised");
    } else {
        next();
    }
} 




const Userauth = (req,res,next) => {
    console.log("User authentication Process Done")
    const token = "xyz";
    const isAdminAuthorised = token === "xyz";
    if(!isAdminAuthorised){
        res.status(401).send("user is not authorised");
    } else {
        next();
    }
} 

module.exports = {
    Adminauth,
    Userauth,
}