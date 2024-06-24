const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
    },
    MiddleName: {
        type: String,
        required: false,
    },
    LastName: {
        type: String,
        required: true,
    },
    Telephone: {
        type: String,
        required: true,
    },
    MobileNumber:{
        type: String,
        required: false,
    },
    Email: {
        type: String,
        required: true,
    },
    State: {
        type: String,
        required: true,
    },
    City: {
        type: String,
        required: true,
    },
    Branch: {
        type: String,
        required: true,
    },
    Aadhar: {
        type: String,
        required: true,
    },
    Pan: {
        type: String,
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    Account_id: {
        type: String,
        default: null
    },
    Password: {
        type: String,
        default: null
    }

});


module.exports = mongoose.model("User", UserSchema);
