const express = require("express");
const User = require("../MODELS/User");
const AccountId = require("../MODELS/AccountId"); // Assuming you have a separate model for AccountIds collection
const router = express.Router();
const crypto = require('crypto');
const Transaction = require("../MODELS/Transaction");

function generateRandomPassword(length) {
    return crypto.randomBytes(length).toString('hex');
}


router.post('/register', async (req, res) => {
    try {
        const { FirstName, MiddleName, LastName, Telephone, MobileNumber, Email, State, City, Branch, Aadhar, Pan } = req.body;
    
        
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
            Aadhar: `https://zigmabank.com/${Aadhar}`,
            Pan: `https://zigmabank.com/${Pan}`,
            isApproved: false
        });

        await newUser.save();
        req.session.userId = newUser._id;

        res.status(200).json({ message: 'This email is being registered, user id and password will be given to the registered mail once verified by admin' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/approve/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);


        if (user.isApproved) {
            return res.status(400).json({ message: 'User is already approved' });
        }

       
        const latestAccountId = await AccountId.findOne().sort({ id: -1 });

        let newAccountId = "ZBKIN202400001"; 

        if (latestAccountId) {
          
            const currentIdNumber = parseInt(latestAccountId.id.slice(-6));
            const newIdNumber = currentIdNumber + 1;
            newAccountId = `ZBKIN2024${String(newIdNumber).padStart(6, '0')}`;
        }

        
        const randomPassword = generateRandomPassword(8); 

       
        user.isApproved = true;
        user.Account_id = newAccountId;
        user.Password = randomPassword;

        
        const accountId = new AccountId({ id: newAccountId });
        await accountId.save();

        await user.save();

        res.status(200).json({ message: 'User approved successfully', Account_id: newAccountId, Password: randomPassword });
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

        
        res.status(200).json({ message: 'Login successful', user: { Account_id: user.Account_id, FirstName: user.FirstName, LastName: user.LastName } });
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
        const account = await AccountId.findById(id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        account.balance = balance;
        await account.save();
        res.status(200).json({ message: 'Balance updated successfully' });
    } catch (err) { 
        res.status(500).json({ message: err.message });
    }
});

// router.post('/transaction', (req, res) => {
//     try {
//         const { SenderAccountId, ReceiverAccountId,Amount } = req.body;
//         const transaction = new Transaction({
//             SenderAccountId,
//             ReceiverAccountId,
//             Amount
//         });
//         transaction.save();
//         res.status(200).json({ message: 'Transaction successful' });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

router.post('/transaction', async (req, res) => {
    try {
        const { SenderAccountId, ReceiverAccountId, Amount } = req.body;
        const transaction = new Transaction({
            SenderAccountId,
            ReceiverAccountId,
            Amount
        });

        const senderAccount = await AccountId.findOne({"id" : SenderAccountId});
        const receiverAccount = await AccountId.findOne({"id" :ReceiverAccountId});

       
        if (!senderAccount || !receiverAccount) {
            return res.status(404).json({ message: 'Account not found' });
        }

    
        if (senderAccount.balance < transaction.Amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }
        
        senderAccount.balance -= Amount;
        await senderAccount.save();

        receiverAccount.balance += Amount;
        await receiverAccount.save();

        await transaction.save();

        res.status(200).json({ message: 'Transaction successful' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// router.get('useraccount/:accountid', async (req, res) => {
//     try {
//         const { accountid } = req.params;
//         const user = await User.findOne({ Account_id: accountid });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json({ user });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

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

        res.status(200).json({ user, transactions, balance: account.balance });
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
module.exports = router;
