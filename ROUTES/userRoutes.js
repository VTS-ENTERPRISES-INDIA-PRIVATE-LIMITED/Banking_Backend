const express = require("express");
const User = require("../MODELS/User");
const router = express.Router();

router.post('/test/user', (req, res) => {
    res.json({ message: 'The Task Routes API is working!' });
});



// User Registration
router.post('/register', async (req, res) => {
    try {
        const { FirstName, MiddleName, LastName, Telephone, MobileNumber,Email,State, City, Branch, Aadhar, Pan,isApproved } = req.body;
    
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
        user.isApproved = true;
        AccountIds = [];
        for (let i = 0; i < 10; i++) {
            AccountIds.push(user._id);
        }
        user.AccountIds = AccountIds;
        await user.save();
        res.status(200).json({ message: 'User approved successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;

