const express = require("express");
const User = require("../MODELS/User");
const crypto = require('crypto');
const AccountId = require("../MODELS/AccountId");
const router = express.Router();
const Transaction = require("../MODELS/Transaction");
const sendCredentials = require("../EmailServiceModule/SendLoginCredentialsMailService")
function generateRandomPassword(length) {
    return crypto.randomBytes(length).toString('hex');
}

router.get('/approve/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isApproved) {
            return res.status(400).json({ message: 'User is already approved' });
        }

        
        const latestAccountId = await AccountId.findOne().sort({ id: -1 });

        let newAccountId = "ZBKIN202400001"; 
        if (latestAccountId) {
            
            const currentIdNumber = parseInt(latestAccountId.id.slice(-6)); 
            const newIdNumber = currentIdNumber + 1;
            newAccountId = `ZBKIN202${String(newIdNumber).padStart(6, '0')}`;
        }

        if(user.isApproved==true){
            return Balance = 500;
        }

        
        const randomPassword = generateRandomPassword(8); 
       
        user.isApproved = true;
        user.Balance = 500;
        user.Account_id = newAccountId;
        user.Password = randomPassword;

        
        const accountId = new AccountId({ id: newAccountId });
        await accountId.save();

        await user.save();
        await sendCredentials(user)
        res.status(200).json({ message: 'User approved successfully', Account_id: newAccountId, Password: randomPassword });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/useraccount/:accountid', async (req, res) => {
    try {
        const { accountid } = req.params;

        const user = await User.findOne({ Account_id: accountid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const transactions = await Transaction.find({ SenderAccountId: accountid });

        const account = await AccountId.findOne({ id: accountid });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        res.status(200).json({ 
            Account_id: user.Account_id,
            Name: `${user.FirstName} ${user.MiddleName} ${user.LastName}`,
            Branch: user.Branch,
            transactions 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/allaccountids', async (req, res) => {
    try {
        const accounts = await AccountId.find();
        res.status(200).json({ accounts });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/summary', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        const users = await User.find();
        const accounts = await AccountId.find();
        let TotalAccounts = 0;
        let TotalBalance = 0;
        let TotalCredits = 0;
        let TotalDebits = 0;

        for (const transaction of transactions) {
            if (transaction.TransactionType === 'Credit') {
                TotalCredits++;
            } else if (transaction.TransactionType === 'Debit') {
                TotalDebits++;
            }
        }

        for (const user of users) {
            TotalBalance += user.Balance;
        }

        for (const account of accounts) {
            TotalAccounts++;
        }

        res.status(200).json({ TotalAccounts,TotalBalance, TotalCredits, TotalDebits });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;
