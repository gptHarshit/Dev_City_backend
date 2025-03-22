const mongoose = require("mongoose");

const connectionrequestSchema = new mongoose.Schema({

    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",   // this indicate the reference to the user collection
        required : true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },
    status : {
        type : String,
        enum : {
            values: ["ignored" , "interested" , "accepted" , "rejected"],
            message : `{VALUE} is not supported`
        },
        required : true
    }
}, {
    timestamps : true,
});

connectionrequestSchema.index({fromUserId : 1 , toUserId : 1});

connectionrequestSchema.pre("save" , function (next) {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself!")
    };
    next();
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest" ,connectionrequestSchema);

module.exports = ConnectionRequestModel;