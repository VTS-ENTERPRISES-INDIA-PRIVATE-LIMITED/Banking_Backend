const mongoose = require("mongoose");

const AccountIdSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model("AccountId", AccountIdSchema);
