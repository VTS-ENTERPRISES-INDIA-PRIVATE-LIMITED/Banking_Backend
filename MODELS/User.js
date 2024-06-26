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
        required: false,
    },
    MobileNumber:{
        type: String,
        required: true,
        length: 10
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
    Pincode: {
        type: String,
        required: true,
    },
    Country: {
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
    Balance: {
        type: Number,
        default: 500,
        required:false
    },
    Password: {
        type: String,
        default: null
    }

});



module.exports = mongoose.model("User", UserSchema);
