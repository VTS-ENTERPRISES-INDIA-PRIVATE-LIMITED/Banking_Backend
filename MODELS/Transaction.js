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
    Credit: {
        type: String,
        required:false
    },
    Debit: {
        type: String,
        required: false
    },
    Status: {
        type: String,
        required: false
    },
    Date: {
        type: Date,
        default: Date.now
    },
    Balance: {
        type: Number,
        ref: "AccountId",
        required: false,
        default: 0
    }

});

TransactionSchema.pre("save", function (next) {
    this.Balance = this.Balance - this.Amount;
    this.Status = "Success";
    if(this.Balance< this.Amount){
        this.Status = "Failed";
    }
    next();
});


module.exports = mongoose.model("Transaction", TransactionSchema);
