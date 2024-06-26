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
const sendConfirmationMail = (username,email)=>{
    const sendConfirmation = async (mailbody) => {
        const info = await mailSender.sendMail({
          from: "teamzigmabank04@gmail.com",
          to: email,
          subject: "Welcome to ZIGMA BANK! Your Registration is Succesful",
          html: mailbody,
        })
        console.log("mail sent", info.response)
      }
    //   const username = "Mohan Ganta"
      const mailbody = `
    <div>
            <img style='width:100%;height:auto;margin-bottom:7px 4px' src='https://res.cloudinary.com/dvmkt80vc/image/upload/v1718962948/WhatsApp_Image_2024-06-21_at_3.02.53_PM_fvdozr.jpg' alt='vts-banner-image'></img>
            <p>Dear ${username},</p>
            <p>Thank you for choosing <strong>ZIGMA BANK </strong>. We are pleased to inform you that your registration has been successfully completed.</p>
            <p>Our team will now begin the process of verifying the documents you submitted. This is to ensure all information provided is accurate and secure.</p>
            <p>Once the document verification is complete, you will receive your login credentials via email. These credentials will allow you to access your account through our website.</p>
            <p style='margin-top:20px;'>We are excited to have you on board and look forward to serving you. </p>
            <p>Welcome to the <strong>ZIGMA BANK Family!</strong> </p>
            <p style='margin-top:60px;'>Best Regards,</p>
            <p>Zigma Bank Customer Support Team</p>
            <p>teamzigmabank@gmail.com</p>
            <p>+91 8000880088</p>
            <p><strong>ZIGMA BANK</strong></p>
            <p><i>This is an automated message. Please do not reply to this email.</i></p>
        </div>
    `
    sendConfirmation(mailbody)
}

module.exports = sendConfirmationMail