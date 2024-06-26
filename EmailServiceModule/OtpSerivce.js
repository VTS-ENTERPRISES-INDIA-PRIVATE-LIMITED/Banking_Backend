const mailSender = require("./MailService")

const generateotp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000)
    return otp
  }

const  sendOtpService =(email)=>{
    const sendotp = async (mailbody) => {
        const info = await mailSender.sendMail({
          from: "teamzigmabank04@gmail.com",
          to: email,
          subject: "Confirm your email",
          html: mailbody,
        })
        console.log("mail sent", info.response)
      }
      const username = "Mohan Ganta"
      const otp = generateotp()
      const mailbody = `
    <div>
            <img style='width:100%;height:auto;margin-bottom:7px 4px' src='https://res.cloudinary.com/dvmkt80vc/image/upload/v1718962948/WhatsApp_Image_2024-06-21_at_3.02.53_PM_fvdozr.jpg' alt='vts-banner-image'></img>
            <p>Hey ${username}</p>
            <p>Thanks for Registering into <strong>ZIGMA BANK</strong></p>
            <p>To complete your Registration please enter the below Verification code</p>
            <p>Verification code : <strong style='font-size:20px'>${otp}</strong></p>
            <p style='margin-top:20px;'>Note that unverified accounts are automatically deleted 30 days after signup.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p style='margin-top:60px;'>Thanks</p>
            <p>Zigma Bank Team</p>
            <p><i>This is an automated message. Please do not reply to this email.</i></p>
        </div>
    `
    
      sendotp(mailbody)
    console.log("otp send")
}

module.exports = sendOtpService