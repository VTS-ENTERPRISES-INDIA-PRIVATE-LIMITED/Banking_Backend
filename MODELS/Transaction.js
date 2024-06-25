const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    SenderAccountId: {
        type: String,
        ref: "AccountId",
        required: true
    },
    ReceiverAccountId: {
        type: String,
        ref: "AccountId",
        required: true
    },
    Amount: {
        type: Number,
        required: true,
    },
    Status: {
        type: String,
        required: false,
        default: 'Pending'
    },
    Date: {
        type: Date,
        default: Date.now
    },
    Balance: {
        type: Number,
        required: false
    },
    TransactionType: {
        type: String,
        required: false,
        enum: ['Credit', 'Debit']
    },
    Summary: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
