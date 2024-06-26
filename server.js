const express = require("express");
const bodyParser = require('body-parser');
const session = require('express-session');
const userRoutes = require('./ROUTES/userRoutes');
const adminRoutes = require('./ROUTES/adminRoutes');

require('dotenv').config();
require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use('/userroutes', userRoutes);
app.use('/adminroutes', adminRoutes);



app.get('/', (req, res) => {
    res.json({
        message: 'The API is working!'
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
