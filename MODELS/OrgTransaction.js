const mongoose = require("mongoose");

const OrgTransactionSchema = new mongoose.Schema({
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
    Salary: {
        type: Number,
        required: true
    },
    Date: {
        type: Date,
        default: Date.now
    },
    BaseSalary: {
        type: Number,
        required: false,
        default: 250000
    },
    HRA: {
        type: Number,
        required: false,
        default: 3000
    },
    LTA: {
        type: Number,
        required: false,
        default: 2000
    },
    Bonus: {
        type: Number,
        required: false,
        default: 2000
    },
    IncomeTax: {
        type: Number,
        required: false,
        default: 1000
    },
    PF: {
        type: Number,
        required: false,
        default: 1500
    },
    Status: {
        type: String,
        required: false,
        default: 'Pending'
    },
    TransactionType: {
        type: String,
        required: false,
        enum: ['Credit', 'Debit']
    }
});

module.exports = mongoose.model("OrgTransaction", OrgTransactionSchema)