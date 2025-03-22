const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    firstName: {
        type : String,
        required : true,
        trim : true,
        maxLength : 30,
        index : true
    },
    lastName: {
        type : String,
        trim : true
    },
    emailId: {
        type : String,
        required : true,
        unique : true,
        trim : true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email address : " + value);
            }
        }
    },
    password: {
        type : String,
        required : true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Enter the Strong password :" + value);
            }
        }
    },
    age : {
        type : Number,
        trim : true
    },
    gender :  {
        type : String,
        trim : true,
        validate(value) {
            if(!["male" , "female" , "other"].includes(value)) {
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl :  {
        type : String,
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Invalid PhotoURL address : " + value);
            }
        }
    },
    skills:  {
        type : [String]
    },
    about :  {
        type : String,
        default : "HI this is my description!!"
    }
}, {
    timestamps : true,
});

userSchema.index({ firstName : 1 , lastName  :1}); 

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({_id : user._id} , "DEV@TINDER$790",{expiresIn: "1d"});
    return token;
} 

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare( passwordInputByUser , passwordHash);
    return isPasswordValid;
}

const User = mongoose.model("User" , userSchema);
module.exports = User;







/**
 * const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        maxLength: [30, "First name cannot exceed 30 characters"]
    },
    lastName: {
        type: String,
        trim: true,
        maxLength: [30, "Last name cannot exceed 30 characters"]
    },
    emailId: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: "Invalid email format"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters long"],
        validate: {
            validator: function (value) {
                return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/.test(value);
            },
            message: "Password must contain at least one letter and one number"
        }
    },
    age: {
        type: Number,
        trim: true,
        min: [10, "Age must be at least 10"],
        max: [100, "Age cannot exceed 100"]
    },
    gender: {
        type: String,
        trim: true,
        enum: {
            values: ["male", "female", "other"],
            message: "Gender must be 'male', 'female' or 'other'"
        }
    },
    photoUrl: {
        type: String,
        validate: {
            validator: function (value) {
                return validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true });
            },
            message: "Invalid URL format for photo"
        }
    },
    skills: {
        type: [String],
        default: []
    },
    about: {
        type: String,
        default: "Hi, this is my description!!",
        maxLength: [200, "About section cannot exceed 200 characters"]
    }
}, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);
module.exports = User;

 */