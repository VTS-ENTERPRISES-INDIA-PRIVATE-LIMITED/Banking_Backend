const express = require("express");
const User = require("../MODELS/User");

const router = express.Router();

router.post('/test/user', (req, res) => {
    res.json({ message: 'The Task Routes API is working!' });
});

// User Registration
router.post('/register', async (req, res) => {
    try {
        const { FirstName, MiddleName, LastName, Telephone, MobileNumber,State, City, Branch } = req.body;
        const newUser = new User({
            FirstName,
            MiddleName,
            LastName,
            Telephone,
            MobileNumber,
            State,
            City,
            Branch
        });
        await newUser.save();
        req.session.userId = newUser._id;

        res.status(200).json({ message: 'Account created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
