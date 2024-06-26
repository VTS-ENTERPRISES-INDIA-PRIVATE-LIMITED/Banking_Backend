const express = require("express");
const bodyParser = require('body-parser');
const session = require('express-session');
const userRoutes = require('./ROUTES/userRoutes');
const adminRoutes = require('./ROUTES/adminRoutes');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');
require('dotenv').config();
require('./db');


const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors())
app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use('/userroutes', userRoutes);
app.use('/adminroutes', adminRoutes);

cloudinary.config({
    cloud_name: 'dsbuzlxpw',
    api_key: '351721674381194',
    api_secret: 'FUdPZVhKZSuQfbtEIVD7PS4KHTc'
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: '',
      resource_type: 'image',
      public_id: (req, file) => file.fieldname + '-' + Date.now()
    }
  });
  
  const upload = multer({ storage: storage });

  app.post('/upload', upload.fields([{ name: 'panCard' }, { name: 'aadharCard' }]), (req, res) => {
    try {
      const panCardUrl = req.files.panCard[0].path;
      const aadharCardUrl = req.files.aadharCard[0].path;
      res.json({ panCardUrl, aadharCardUrl });
    } catch (error) {
      console.error('Error uploading images', error);
      res.status(500).json({ error: 'Failed to upload images' });
    }
  });
app.get('/', (req, res) => {
    res.json({
        message: 'The API is working!'
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
