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

const validateUpdatedPassword = (req) => {
    const { password } = req.body;
    if(!validator.isStrongPassword(password)) {
        throw new Error("Enter the strong password");
    }
}

const validateEditProfileData = (req) => {
    console.log(" OBJECT IN VALIDATION  " + req.body);
    const allowedEditFields = ["firstName", "lastName","emailId", "age" , "skills" , "photoUrl" , "about" ,"gender"];
    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));
    console.log("validated");
    return isEditAllowed;
}

module.exports = {
    ValidateSignUpData,
    validateEditProfileData,
    validateUpdatedPassword,
}