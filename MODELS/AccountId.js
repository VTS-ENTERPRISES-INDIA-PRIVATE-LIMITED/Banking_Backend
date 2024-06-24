const mongoose = require("mongoose");

const AccountIdSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: false,
        default: 0
    }
});

module.exports = mongoose.model("AccountId", AccountIdSchema);
