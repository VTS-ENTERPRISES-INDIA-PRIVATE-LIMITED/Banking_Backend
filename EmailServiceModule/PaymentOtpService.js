const mailSender = require("./MailService");

const generatePaymentOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
};

const sendPaymentOtpService = (email, username, amount) => {
    const sendOtpEmail = async (mailBody) => {
        const info = await mailSender.sendMail({
            from: "zigmabank@gmail.com",
            to: email,
            subject: "Payment Verification OTP",
            html: mailBody,
        });
        console.log("Payment verification OTP sent", info.response);
    };

    const otp = generatePaymentOtp();
    const mailBody = `
        <div>
            <img style='width:100%;height:auto;margin-bottom:7px 4px' src='https://res.cloudinary.com/dvmkt80vc/image/upload/v1718962948/WhatsApp_Image_2024-06-21_at_3.02.53_PM_fvdozr.jpg' alt='vts-banner-image'></img>
            <p>Hey ${username}</p>
            <p>To complete your payment of <strong>${amount}</strong>, please enter the below Verification Code</p>
            <p>Verification code : <strong style='font-size:20px'>${otp}</strong></p>
            <p style='margin-top:20px;'>If you didn't request this, please contact our support team immediately.</p>
            <p>Contact us at: <a href="mailto:support@zigmabank.com">support@zigmabank.com</a> or call us at: <strong>123-456-7890</strong></p>
            <p style='margin-top:60px;'>Thanks</p>
            <p>Zigma Bank Team</p>
            <p><i>This is an automated message. Please do not reply to this email.</i></p>
        </div>
    `;
    sendOtpEmail(mailBody);
    return otp;
};

module.exports = sendPaymentOtpService;
