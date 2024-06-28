const mongoose =require("mongoose");

const OrganisationSchema = new mongoose.Schema({

       Name: {
        type: String,
        required: true
    },
    Account_id :{
        type:String,
        required:true
    },
       Revenue:{
        type: Number,
        required: false,
        default: 1000000000
    },

});

module.exports = mongoose.model("Organisation", OrganisationSchema);