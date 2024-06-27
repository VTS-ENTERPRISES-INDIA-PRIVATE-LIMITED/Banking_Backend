const express = require("express");
const User = require("../MODELS/User");
const AccountId = require("../MODELS/AccountId");
const router = express.Router();
const crypto = require('crypto');
const Transaction = require("../MODELS/Transaction");
const Organisation = require("../MODELS/Organisation");
const sendRegistrationConfirmationMail = require('../EmailServiceModule/ConfirmationMailService');
const newRegistrationMail = require('../EmailServiceModule/NewRegistrationMailService');
function generateRandomPassword(length) {
    return crypto.randomBytes(length).toString('hex');
}

router.post('/register', async (req, res) => {
    try { 

        const { FirstName, MiddleName, LastName, Telephone, MobileNumber, Email, State, City, Branch,Pincode,Country,Aadhar, Pan } = req.body;

        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ message: 'User is already registered with this email' });
        }

        const newUser = new User({
            FirstName,
            MiddleName,
            LastName,
            Telephone,
            MobileNumber,
            Email,
            State,
            City,
            Branch,
            Pincode,
            Country,
            Aadhar: `https://zigmabank.com/${Aadhar}`,
            Pan: `https://zigmabank.com/${Pan}`,
            isApproved: false
        });
        const username = `${FirstName} ${LastName}`
        const email = newUser.Email
        await newUser.save();
        req.session.userId = newUser._id;
        await sendRegistrationConfirmationMail(username, email);
        await newRegistrationMail(newUser);

        res.status(200).json({ message: 'This email is being registered, user id and password will be given to the registered mail once verified by admin' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { Account_id, Password } = req.body;

        const user = await User.findOne({ Account_id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.Password !== Password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({
            message: 'Login successful',
            user: {
                Account_id: user.Account_id,
                FirstName: user.FirstName,
                LastName: user.LastName,
                Branch: user.Branch,
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.put('/updatepassword/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { Password } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.Password = Password;
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/updatebalance/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { balance } = req.body;
        const account = await User.findById(id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        account.Balance = balance;
        await account.save();
        res.status(200).json({ message: 'Balance updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/transaction', async (req, res) => {
    try {
        const { SenderAccountId, ReceiverAccountId, Amount } = req.body;

        const senderAccount = await User.findOne({ Account_id: SenderAccountId });
        const receiverAccount = await User.findOne({ Account_id: ReceiverAccountId });

        if (!senderAccount || !receiverAccount) {
            return res.status(404).json({ message: 'Account not found' });
        }

        let transactionStatus = 'Transaction Success';
        if (senderAccount.Balance < Amount) {
            transactionStatus = 'Transaction Failed';
            const failedTransaction = new Transaction({
                SenderAccountId,
                ReceiverAccountId,
                Amount,
                Status: transactionStatus,
                TransactionType: 'Debit'
            });
            await failedTransaction.save();
            return res.status(400).json({ message: 'Insufficient balance', transaction: failedTransaction });
        }

        senderAccount.Balance -= Amount;
        receiverAccount.Balance += Amount;

        await senderAccount.save();
        await receiverAccount.save();

        const debitTransaction = new Transaction({
            SenderAccountId,
            ReceiverAccountId,
            Amount,
            Status: transactionStatus,
            Balance: senderAccount.Balance,
            TransactionType: 'Debit'
        });

        const creditTransaction = new Transaction({
            SenderAccountId,
            ReceiverAccountId,
            Amount,
            Status: transactionStatus,
            Balance: receiverAccount.Balance,
            TransactionType: 'Credit'
        });

        await debitTransaction.save();
        await creditTransaction.save();

        res.status(200).json({
            message: 'Transaction successful',
            transactions: {
                debitTransaction,
                creditTransaction
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.route("/recharges").post(async (req,res)=>{
    const acid = req.body.AccountId
    const amt = req.body.Amount
    User.findOne({Account_id : acid})
    .then(async (user)=>{
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const balance = user.Balance
        if(balance < amt){
            const newTransaction = new Transaction({
                SenderAccountId : acid,
                ReceiverAccountId : "Zigmanetwork provider",
                Amount : amt,
                Status : "Recharge Failed",
                Balance : balance,
                TransactionType : "Debit"
            })
            newTransaction.save()
            .catch((err)=>{
                console.log(err)
            })
            res.status(400).json({message : "Insufficient Balance"})
        }
        else{
            user.Balance -= amt-3
            user.save()
            const newTransaction = new Transaction({
                SenderAccountId : acid,
                ReceiverAccountId : "Zigmanetwork provider",
                Amount : amt,
                Status : "Recharge Success",
                Balance : user.Balance,
                TransactionType : "Debit"
            })
            newTransaction.save()
            const orgs1 = new Organisation({
                orgs1 : await Organisation.find({Name: "ZIGMA NETWORKS"}),
                Revenue : Revenue+amt
            })
            orgs1.save()

            const orgs2 = new Organisation({
                orgs2 : await Organisation.find({Name: "ZIGMA BANK"}),
                Revenue : Revenue+3
            })
            orgs2.save()
            .catch((err)=>{
                console.log(err)
            })
            res.status(200).json({message : "Recharge Successful"})
        }
    })
})

module.exports = router;
