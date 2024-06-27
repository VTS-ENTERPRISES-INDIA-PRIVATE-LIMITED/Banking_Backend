const express = require("express");
const bodyParser = require('body-parser');
const session = require('express-session');
const userRoutes = require('./ROUTES/userRoutes');
const adminRoutes = require('./ROUTES/adminRoutes');
const sendRegisterOtp = require("./EmailServiceModule/OtpSerivce")
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

app.get('/', (req, res) => {
    res.json({
        message: 'The API is working!'
    });
});
app.get("/sendregisterotp/:email/:user",async (req,res)=>{
  console.log("lfajjdfl;alsdk")
   const otp =  await sendRegisterOtp(req.params.email,req.params.user)
  console.log(otp)
  res.send({"otp":otp})
})


app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
