const mailSender = require("./MailService")

const sendLoginCredentialsMail = (user)=>{
    const sendLoginCredentials = async (mailbody) => {
        const info = await mailSender.sendMail({
          from: "teamzigmabank04@gmail.com",
          to: user.Email,
          subject: "Your ZIGMA BANK Account is Ready!!!",
          html: mailbody,
        })
        console.log("mail sent", info.response)
      }
      const username = `${user.FirstName} ${user.LastName}`
      const Account_Id = user.Account_id
      const password = user.Password
      const loginurl = "www.google.com"
      const reseturl = "www.youtube.com"
      const mailbody = `
    <div>
            <img style='width:100%;height:auto;margin-bottom:7px 4px' src='https://res.cloudinary.com/dvmkt80vc/image/upload/v1718962948/WhatsApp_Image_2024-06-21_at_3.02.53_PM_fvdozr.jpg' alt='vts-banner-image'></img>
            <p>Dear ${username},</p>
            <p>We are pleased to inform you that the verification of your submitted documents has been successfully completed. Welcome to <strong>ZIGMA BANK family!</strong></p>
            <p>As part of this process, we have created your account and assigned you the following account ID: </p>
            <p><strong>Account ID: ${AcId}</strong></p>
            <p><h4>Your Login credentials</h4></p>
            <p><strong>Account ID : ${Account_Id}</strong></p>
            <p><strong>Password : ${password}</strong></p>
            <p style='color:red' >For your protection, never share your login credentials with anyone. Unauthorized access to your account can result in financial loss and compromise your personal information.</p>
            <p>We encourage you to log in to the site using the button below and explore the resources available to you.  We strongly recommend that you reset your password immediately after your first login. This will help ensure the security of your account. You can do this by clicking the 'Reset Password' button provided.</p>
            <div style='width:100%;display:flex;justify-content:center;text-align:center;margin-top:30px;margin-bottom:50px'>
            <div><a style='margin:2px 10px;border:1px solid black;background-color:#28376e;padding:10px;color:white;text-decoration:none;' href=${loginurl}>Login to Site</a></div>
            <div><a style='margin:2px 10px;border:1px solid black;background-color:#28376e;padding:10px;color:white;text-decoration:none;' href=${reseturl}>Reset Password</a></div>
            </div>
            <p style='margin-top:20px;'>If you have any questions or need further assistance, our customer service team is here to help. You can reach us at +91 1234XXXX90  or teamzigmabank@gmail.com.</p>
            <p >We are excited to have you as a part of the <strong>ZIGMA BANK family!</strong> and look forward to providing you with exceptional banking services. </p>
            <p style='margin-top:60px;'>Best regards,</p>
            <p>Zigma Bank customer Support Team</p>
            <p>teamzigmabank@gmail.com</p>
            <p>+91 8000880088</p>
            <p><strong>ZIGMA BANK</strong></p>
            <p><i>This is an automated message. Please do not reply to this email.</i></p>
        </div>
    `
    
      sendLoginCredentials(mailbody)
}

module.exports = sendLoginCredentialsMail