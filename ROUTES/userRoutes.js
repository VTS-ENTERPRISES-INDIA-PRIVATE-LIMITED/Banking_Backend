const express = require("express");
const User = require("../MODELS/User");
const AccountId = require("../MODELS/AccountId"); // Assuming you have a separate model for AccountIds collection
const router = express.Router();
const crypto = require('crypto');

// Function to generate random password
function generateRandomPassword(length) {
    return crypto.randomBytes(length).toString('hex');
}

// User Registration
router.post('/register', async (req, res) => {
    try {
        const { FirstName, MiddleName, LastName, Telephone, MobileNumber, Email, State, City, Branch, Aadhar, Pan } = req.body;
    
        // Check if the email is already registered
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

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isApproved) {
            return res.status(400).json({ message: 'User is already approved' });
        }

        // Get the latest account ID from AccountIds collection
        const latestAccountId = await AccountId.findOne().sort({ id: -1 });

        let newAccountId = "ZBKIN202400001"; // Default initial value

        if (latestAccountId) {
            // Increment the latest account ID
            const currentIdNumber = parseInt(latestAccountId.id.slice(-6));
            const newIdNumber = currentIdNumber + 1;
            newAccountId = `ZBKIN2024${String(newIdNumber).padStart(6, '0')}`;
        }

        // Generate a random password
        const randomPassword = generateRandomPassword(8); // Length can be adjusted

        // Update user data
        user.isApproved = true;
        user.Account_id = newAccountId;
        user.Password = randomPassword;

        // Save the new account ID back to the AccountIds collection
        const accountId = new AccountId({ id: newAccountId });
        await accountId.save();

        await user.save();

        res.status(200).json({ message: 'User approved successfully', Account_id: newAccountId, Password: randomPassword });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
