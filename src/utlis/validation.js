const validator = require('validator')
const ValidateSignUpData = (req) => {

    const { firstName , lastName , emailId , password} = req.body;

    if(!firstName || !lastName) {
        throw new Error("Name is not valid!")
    } 
    else if(firstName.length < 2 || firstName.length > 50) {
        throw new Error("Emter the Name with a valid length")
    } else if(!validator.isEmail(emailId)) {
        throw new Error("Email is  not valid");
    } else if(!validator.isStrongPassword(password)) {
        throw new Error("Enter the strong password");
    }
}

module.exports = {
    ValidateSignUpData,
}