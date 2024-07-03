const mailSender = require("./MailService");

const sendResetPasswordLinkMail = (email,username) => {
    const sendOtpEmail = async (mailBody) => {
        const info = await mailSender.sendMail({
            from: "zigmabank@gmail.com",
            to: email,
            subject: "Reset your Password!!!!",
            html: mailBody,
        });
        console.log("Reset pwd mail sent", info.response);
    };
    const reseturl = `http://localhost:3000/resetpassword/${email}`
    const mailBody = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="margin-bottom: 20px;">
            <img src="https://res.cloudinary.com/dvmkt80vc/image/upload/v1718962948/WhatsApp_Image_2024-06-21_at_3.02.53_PM_fvdozr.jpg" alt="Zigma Bank" style="width: 100%; max-width: 600px;">
        </div>
        <div>
            <p>Dear Customer,</p>
            <p>We have received your request to change your password.</p>
            <p>Please click the button below to reset your password:</p>
                       <div><a style='margin:2px 10px;border:1px solid black;background-color:#28376e;padding:10px;color:white;text-decoration:none;' href=${reseturl}>Reset Password</a></div>
                        <ul>
        <li><strong>Length:</strong> Your password should be at least 8 characters long.</li>
        <li><strong>Complexity:</strong> Include a mix of uppercase letters, lowercase letters, numbers, and special characters (e.g., !@#$%^&*).</li>
        <li><strong>Avoid Common Patterns:</strong> Do not use easily guessable patterns or common words.</li>
        <li><strong>Unique:</strong> Use a password unique to this account.</li>
        <li><strong>Change Regularly:</strong> Consider changing your password periodically for security reasons.</li>
    </ul>
            <p>If you did not request this change, please ignore this email.</p>
            <p style="margin-top: 20px;">Contact us at: <a href="mailto:support@zigmabank.com">support@zigmabank.com</a> or call us at: <strong>123-456-7890</strong></p>
            <p>Thanks,</p>
            <p>Zigma Bank Team</p>
            <p style="font-size: 0.8em;"><i>This is an automated message. Please do not reply to this email.</i></p>
        </div>
    </div>
`;

    sendOtpEmail(mailBody);
  
};

module.exports = sendResetPasswordLinkMail;
