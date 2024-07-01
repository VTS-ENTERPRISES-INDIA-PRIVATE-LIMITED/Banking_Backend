const express = require("express");
const bodyParser = require('body-parser');
const session = require('express-session');
const userRoutes = require('./ROUTES/userRoutes');
const adminRoutes = require('./ROUTES/adminRoutes');
const orgRoutes = require('./ROUTES/orgRoutes')
const sendRegisterOtp = require("./EmailServiceModule/OtpSerivce")
const paymentOtp = require("./EmailServiceModule/PaymentOtpService")
const paymentMail = require("./EmailServiceModule/PaymentSalaryMail");
const OrgTransaction = require("./MODELS/OrgTransaction");
const User = require("./MODELS/User");
const cors = require('cors');
require('dotenv').config();
require('./db');


const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors())
app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/org',orgRoutes)

app.get('/', (req, res) => {
    res.json({
        message: 'The API is working!'
    });
});
app.get("/sendregisterotp/:email/:user",async (req,res)=>{
  console.log("lfajjdfl;alsdk")
   const otp =  await sendRegisterOtp(req.params.email,req.params.user)
  res.send({"otp":otp})
})

app.get("/sendpaymentotp/:email/:username",async (req,res)=>{
     const otp =  await paymentOtp(req.params.email,req.params.username)
    res.send({"otp":otp})
  })
app.get("/salary/:id", async (req, res) => {
    const id = req.params.id;
    const transaction = await OrgTransaction.findById(id);
    const receiver = await User.findOne({ Account_id: transaction.ReceiverAccountId });
    transaction.TransactionType = "Credit";
    transaction.Status = "Success";
    await paymentMail(transaction, receiver.Email);
    res.send({"message":"success"})
    
  })


app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
