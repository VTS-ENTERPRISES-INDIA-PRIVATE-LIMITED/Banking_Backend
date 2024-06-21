const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
    },
    MiddleName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        required: true,
    },
    Telephone: {
        type: Number,
        required: true,
    },
    MobileNumber:{
        type: Number,
        required: false,
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

});


module.exports = mongoose.model("User", UserSchema);
