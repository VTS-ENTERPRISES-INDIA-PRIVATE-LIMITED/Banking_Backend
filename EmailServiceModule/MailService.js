const nodemailer = require('nodemailer')
const mailSender = nodemailer.createTransport(
  {
    service: 'gmail',
    auth: {
      user: 'zigmabank@gmail.com',
      pass: 'jefezobqegrvpkru',
    },
  }
)

module.exports = mailSender