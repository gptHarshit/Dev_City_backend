const mongoose = require("mongoose");

const connectDB  = async () => {
   await mongoose.connect("mongodb+srv://comedybits37:RoAtZtLdiIifgrCG@cluster0.rw3pf.mongodb.net/DevTinder");
}

module.exports = connectDB;


