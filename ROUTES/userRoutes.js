const express = require("express");
const User = require("../MODELS/User");
const AccountId = require("../MODELS/AccountId");
const router = express.Router();
const crypto = require('crypto');
const Transaction = require("../MODELS/Transaction");
const Organisation = require("../MODELS/Organisation");
const sendRegistrationConfirmationMail = require('../EmailServiceModule/ConfirmationMailService');
const newRegistrationMail = require('../EmailServiceModule/NewRegistrationMailService');
const debitTransactionMail = require('../EmailServiceModule/PaymentDebitMail');
const creditTransactionMail = require('../EmailServiceModule/PaymentCreditMail');
const sendResetpasswordMail = require("../EmailServiceModule/SendResetpasswordMail");
const sendResetPasswordLinkMail = require("../EmailServiceModule/SendResetpasswordMail");
function generateRandomPassword(length) {
    return crypto.randomBytes(length).toString('hex');
}

router.post('/register', async (req, res) => {
    try { 
        const { FirstName, MiddleName, LastName, Telephone, MobileNumber, Email, State, City, Branch, Pincode, Country, Aadhar, Pan } = req.body;

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
            Aadhar: `${Aadhar}`,
            Pan: `${Pan}`,
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
router.get("/sendresetpasswordmail/:email",async(req,res)=>{
  await sendResetPasswordLinkMail(req.params.email)
  res.send("mail sent")
})
router.route('/login/:acid/:pwd').get(async (req, res) => {
    try {
        const Account_id = req.params.acid
        const Password = req.params.pwd
        const user = await User.findOne({ Account_id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.Password !== Password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({
            message: 'Login successful',
            user: user
        });
    } catch (err) {
        res.status(500).json({ message: "hey bhayya avvatledhu" });
    }
});


router.put('/resetpassword/:email', async (req, res) => {
  const { email } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({ Email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.Password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
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


router.get('/getallusertransactions/:AccountId', async (req, res) => {
  const { AccountId } = req.params;

  try {
    const transactions = await Transaction.find({
      $or: [
        { SenderAccountId: AccountId },
        { ReceiverAccountId: AccountId }
      ]
    }).sort({ Date: -1 }); 

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.post('/transaction', async (req, res) => {
    try {
      const { SenderAccountId, ReceiverAccountId, Amount } = req.body;
  
      const amount = parseInt(Amount);
  
      const senderAccount = await User.findOne({ Account_id: SenderAccountId });
      const receiverAccount = await User.findOne({ Account_id: ReceiverAccountId });
  
      if (!senderAccount || !receiverAccount) {
        return res.status(404).json({ message: 'One or both accounts not found' });
      }
  
      if (senderAccount.Balance < amount) {
        const failedTransaction = new Transaction({
          SenderAccountId,
          ReceiverAccountId,
          Amount,
          Status: 'Transaction Failed',
          TransactionType: 'Debit'
        });
        await failedTransaction.save();
        return res.status(400).json({ message: 'Insufficient balance', transaction: failedTransaction });
      }
  
      const session = await User.startSession();
      session.startTransaction();
  
      try {
        senderAccount.Balance -= amount;
        receiverAccount.Balance += amount;
  
        await senderAccount.save({ session });
        await receiverAccount.save({ session });
  
        const debitTransaction = new Transaction({
          SenderAccountId,
          ReceiverAccountId,
          Amount: amount,
          Status: 'Success',
          Balance: senderAccount.Balance,
          TransactionType: 'Debit',
        });
  
        const creditTransaction = new Transaction({
          SenderAccountId,
          ReceiverAccountId,
          Amount: amount,
          Status: 'Success',
          Balance: receiverAccount.Balance,
          TransactionType: 'Credit'
        });
  
        await debitTransaction.save({ session });
        await creditTransaction.save({ session });
  
        await debitTransactionMail(debitTransaction, senderAccount.Email);
        await creditTransactionMail(creditTransaction, receiverAccount.Email);
  
        await session.commitTransaction();
        session.endSession();
  
        res.status(200).json({
          message: 'Transaction successful',
          transactions: {
            debitTransaction,
            creditTransaction
          }
        });
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    } catch (err) {
      console.error('Error processing transaction', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });



router.route("/recharges").post(async (req, res) => {
    const acid = req.body.SenderAccountId;
    const amt = req.body.Amount;
    const platformFee = 3;
    const totalAmount = amt + platformFee;

    try {
        const user = await User.findOne({ Account_id: acid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (user.Balance < totalAmount) {
            const newTransaction = new Transaction({
                SenderAccountId: acid,
                ReceiverAccountId: "Zigmanetwork provider",
                Amount: amt,
                Status: "Recharge Failed",
                Balance: user.Balance,
                TransactionType: "Debit"
            });
            await newTransaction.save();
            return res.status(400).json({ message: "Insufficient Balance" });
        }
        user.Balance -= totalAmount;
        await user.save();

        const newTransaction = new Transaction({
            SenderAccountId: acid,
            ReceiverAccountId: "Zigmanetwork provider",
            Amount: amt,
            Status: "Recharge Success",
            Balance: user.Balance,
            TransactionType: "Debit"
        });
        await newTransaction.save();

        const orgNetwork = await Organisation.findOne({ Name: "ZIGMA NETWORKS" });
        orgNetwork.Revenue += amt-3;
        await orgNetwork.save();

        const orgBank = await Organisation.findOne({ Name: "ZIGMA BANK" });
        orgBank.Revenue += platformFee;
        await orgBank.save();

        res.status(200).json({ message: "Recharge Successful" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

  


router.get('/transactions/:AccountId', async (req, res) => {
  const { AccountId } = req.params;

  try {
    const creditSum = await Transaction.aggregate([
      { $match: { ReceiverAccountId: AccountId, TransactionType: 'Credit' } },
      { $group: { _id: null, totalCreditAmount: { $sum: '$Amount' } } }
    ]);

    const debitSum = await Transaction.aggregate([
      { $match: { SenderAccountId: AccountId, TransactionType: 'Debit' } },
      { $group: { _id: null, totalDebitAmount: { $sum: '$Amount' } } }
    ]);

    const result = {
      totalCreditAmount: creditSum.length > 0 ? creditSum[0].totalCreditAmount : 0,
      totalDebitAmount: debitSum.length > 0 ? debitSum[0].totalDebitAmount : 0
    };

    res.json(result);
  } catch (err) {
    console.error('Error fetching transaction sums:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;
