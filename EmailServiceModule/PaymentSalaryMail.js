const mailSender = require("./MailService")
// Function to send payment receipt email
const sendPaymentReceiptMail = (transaction,mail) => {
  const sendSalaryPaySlip = async (mailbody) => {
    try {
      const info = await mailSender.sendMail({
        from: "zigmabank@gmail.com",
        to: mail,
        subject: "✅ You have received a new Credit Transaction from VTS Enterprises.Check details!",
        html: mailbody,
      });
      console.log("Mail sent", info.response);
    } catch (error) {
      console.error("Error sending mail", error);
    }
  };

  const transactionData = {
    Sender_Id: transaction.SenderAccountId,
    Receiver_Id: transaction.ReceiverAccountId,    
    NetPay: transaction.Salary,
    date: transaction.Date,
    TransactionId: transaction._id,
    BasicSalary: transaction.BaseSalary,
    HRA: transaction.HRA,
    LTA: transaction.LTA,
    Bonus: transaction.Bonus,
    IncomeTax: transaction.IncomeTax,
    PF: transaction.PF,
    TransactionType: transaction.TransactionType,
    TransactionStatus: transaction.Status
  };

  const { Sender_Id ,Receiver_Id,NetPay, date, TransactionId,BasicSalary, HRA, LTA, Bonus, IncomeTax, PF, TransactionType ,TransactionStatus} = transactionData;
  const mailbody = `
  <div>
    <img style='width:100%;height:auto;margin-bottom:7px 4px' src='https://res.cloudinary.com/dvmkt80vc/image/upload/v1718962948/WhatsApp_Image_2024-06-21_at_3.02.53_PM_fvdozr.jpg' alt='vts-banner-image'></img>
    <h1>Transaction Details</h1>
    <div style="padding:10px">
      <p>Dear Customer,</p>
      <p>Rs.${NetPay} has been credited to your A/C from ${Sender_Id} to ${Receiver_Id} on ${date}. Find your Transaction details below</p>
    </div>
    <div style="padding:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;border:1px solid black">
        <div style='display:flex;justify-content:center;align-items:center;width:60%;'>
          <img style="width:45%;height:auto" src="https://res.cloudinary.com/dvmkt80vc/image/upload/v1719315184/titleZIGMA-removebg-preview_gdrxg4.png"/>
        </div>
        <div style='display:flex;justify-content:center;align-items:center;width:40%'>
          <p style="text-align:start;">D/no:123<br></br>PTK Nagar, Thiruvanmiyur<br></br>Chennai, INDIA</p>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <th colspan="2" style="text-align: end;font-weight: bold; text-align: start;font-weight: bold;text-align: end;font-weight: bold; border: 1px solid black;padding: 10px;text-align: start;">
            <strong>Account Information</strong>
          </th>
        </tr>
        <tr>
          <td style="border: 1px solid black;padding: 10px;text-align: start;">Transaction ID</td>
          <td style="border: 1px solid black;padding: 10px;text-align: start;">TXN${TransactionId}</td>
        </tr>
        <tr>
          <td style="border: 1px solid black;padding: 10px;text-align: start;">Sender Account No</td>
          <td style="border: 1px solid black;padding: 10px;text-align: start;">${Sender_Id}</td>
        </tr>
      </table>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <th colspan="2" style="text-align: end;font-weight: bold; border: 1px solid black;padding: 10px;text-align: start;">
            <strong>Payment Details</strong>
          </th>
        </tr>
        <tr>
          <td style="border: 1px solid black;padding: 10px;text-align: start;">Basic Salary</td>
          <td style="border: 1px solid black;padding: 10px;text-align: end;">${BasicSalary}</td>
        </tr>
        <tr>
          <td style="border: 1px solid black;padding: 10px;text-align: start;">HRA</td>
          <td style="border: 1px solid black;padding: 10px;text-align: end;">+${HRA}</td>
        </tr>
        <tr>
          <td style="border: 1px solid black;padding: 10px;text-align: start;">LTA</td>
          <td style="border: 1px solid black;padding: 10px;text-align: end;">+${LTA}</td>
        </tr>
        <tr>
          <td style="border: 1px solid black;padding: 10px;text-align: start;">Bonus</td>
          <td style="border: 1px solid black;padding: 10px;text-align: end;">+${Bonus}</td>
        </tr>
        <tr>
          <td style="border: 1px solid black;padding: 10px;text-align: start;">Income Tax</td>
          <td style="border: 1px solid black;padding: 10px;text-align: end;">-${IncomeTax}</td>
        </tr>
        <tr>
          <td style="border: 1px solid black;padding: 10px;text-align: start;">Provident Fund</td>
          <td style="border: 1px solid black;padding: 10px;text-align: end;">-${PF}</td>
        </tr>
        <tr>
          <td style="border: 1px solid black;padding: 10px;text-align: start;">Transaction Type:</td>
          <td style="border: 1px solid black;padding: 10px;text-align: end;">${TransactionType}</td>
        </tr>
        <tr>
          <td style="border: 1px solid black;padding: 10px;text-align: start;">Transaction Status:</td>
          <td style="border: 1px solid black;padding: 10px;text-align: end;">✅${TransactionStatus}</td>
        </tr>
        <tr>
          <th style="font-weight: bold; border: 1px solid black;padding: 10px;text-align: start;">
            <strong>Total Amount</strong>
          </th>
          <th style="font-weight: bold; border: 1px solid black;padding: 10px;text-align: end;">
            <strong>${NetPay}</strong>
          </th>
        </tr>
      </table>
      <div style="padding:10px;margin-top:20px;">
        <p style='color:red'>If you did not authorize this transaction, please report it immediately by calling +91 1234567890 or mail us at zigmabank@gmail.com</p>
        <p>Warm Regards,</p>
        <img style="width:24%;height:auto" src="https://res.cloudinary.com/dvmkt80vc/image/upload/v1719315184/titleZIGMA-removebg-preview_gdrxg4.png"></img>
        <p><strong>ZIGMA BANK</strong></p>
        <p></p>
        <p>zigmabank@gmail.com</p>
        <p><i>This is an automated message. Please do not reply to this email.</i></p>
      </div>
    </div>
  </div>
  `;

  sendSalaryPaySlip(mailbody);
};


module.exports = sendPaymentReceiptMail;