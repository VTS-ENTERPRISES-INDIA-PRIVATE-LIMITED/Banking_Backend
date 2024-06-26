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
        
router.get("/transactions/summary/:senderAccountId", async (req, res) => {
    const { senderAccountId } = req.params;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
    try {
      console.log(`Fetching transactions for senderAccountId: ${senderAccountId} since ${oneMonthAgo}`);
  
      const transactions = await Transaction.aggregate([
        { $match: { SenderAccountId: senderAccountId, Date: { $gte: oneMonthAgo } } },
        {
          $group: {
            _id: "$SenderAccountId",
            totalDebitedAmount: {
              $sum: {
                $cond: [{ $eq: ["$TransactionType", "Debit"] }, "$Amount", 0]
              }
            },
            totalCreditedAmount: {
              $sum: {
                $cond: [{ $eq: ["$TransactionType", "Credit"] }, "$Amount", 0]
              }
            }
          }
        }
      ]);
  
      console.log("Aggregation result:", transactions);
  
      if (transactions.length === 0) {
        console.log(`No transactions found for senderAccountId: ${senderAccountId}`);
        return res.status(404).json({ totalDebitedAmount: 0, totalCreditedAmount: 0 });
      }
  
      console.log(`Transactions summary for senderAccountId: ${senderAccountId}`, transactions[0]);
      res.json(transactions[0]);
    } catch (error) {
      console.error("Error fetching transactions", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  router.get('/transactions/:accountId', async (req, res) => {
    const { accountId } = req.params;
  
    try {
      const transactions = await Transaction.find({ $or: [{ SenderAccountId: accountId }, { ReceiverAccountId: accountId }] })
                                            .sort({ Date: -1 })
                                            .exec();
  
      if (transactions.length === 0) {
        return res.status(404).json({ message: 'No transactions found for this account' });
      }
  
      res.json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
module.exports = router;
