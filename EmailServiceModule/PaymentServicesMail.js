const mailSender = require("./MailService")

const sendPaymentReceiptMail = (transactionData)=>{
    const sendRechargeslip = async (mailbody) => {
        const info = await mailSender.sendMail({
          from: "zigmabank@gmail.com",
          to: "tempabc70759@gmail.com",
          subject: "✅ You have done a new Transaction.Check details!",
          html: mailbody,
        })
        console.log("mail sent", info.response)
      }
    
      const Account_Id = "ZBKIN0000234"
      const total = "103"
      const lastdig = "234"
      const date = "25/06/2024"
      const TransactionId = "9876543456789"
      const Amount = "100"
      const discount = 0
      const mailbody = `
      <div>
     <img style='width:100%;height:auto;margin-bottom:7px 4px' src='https://res.cloudinary.com/dvmkt80vc/image/upload/v1718962948/WhatsApp_Image_2024-06-21_at_3.02.53_PM_fvdozr.jpg' alt='vts-banner-image'></img>
    <h1>Transaction Details</h1>
    <div style="padding:10px">
      <p>Dear Customer,</p>
      <p>Rs.${total} has a been debited from your A/C ZBKIN0XXX${lastdig} on ${date}. Find your Transaction details below</p>
    </div>
    <div style="padding:10px" >
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;border:1px solid black">
            <div style='display:flex;justify-content:center;align-items:center;width:60%;'> <img style="width:45%;height:auto"  src="https://res.cloudinary.com/dvmkt80vc/image/upload/v1719315184/titleZIGMA-removebg-preview_gdrxg4.png"/></div>
            <div style='display:flex;justify-content:center;align-items:center;width:40%'><p style="text-align:start;">D/no:123<br></br>PTK Nagar ,Thiruvanmiyur<br></br>Chennai ,INDIA</p> </div>
        </div>
    
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <th colspan="2" style="text-align: end;font-weight: bold; text-align: start;font-weight: bold;text-align: end;font-weight: bold; border: 1px solid black;padding: 10px;text-align: start;"><strong>Account Information</strong></th>
            </tr>
            <tr>
                <td style="border: 1px solid black;padding: 10px;text-align: start;">Account No</td>
                <td style="border: 1px solid black;padding: 10px;text-align: start;">${Account_Id}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black;padding: 10px;text-align: start;">Transaction ID</td>
                <td style="border: 1px solid black;padding: 10px;text-align: start;">TR${TransactionId}</td>
            </tr>
        </table>
    
        <table style="width: 100%; border-collapse: collapse;" >
            <tr>
                <th colspan="2" style="text-align: end;font-weight: bold; border: 1px solid black;padding: 10px;text-align: start;" ><strong>Payment Details</strong></th>
            </tr>
            <tr>
                <td style="border: 1px solid black;padding: 10px;text-align: start;">Recharge Amount:</td>
                <td style="border: 1px solid black;padding: 10px;text-align: end;">${Amount}</td>
            </tr>
            <tr>
                <td style="border: 1px solid black;padding: 10px;text-align: start;">SGST@2.5%</td>
                <td style="border: 1px solid black;padding: 10px;text-align: end;">+3</td>
            </tr>
            <tr>
                <td style="border: 1px solid black;padding: 10px;text-align: start;">Discount</td>
                <td style="border: 1px solid black;padding: 10px;text-align: end;">${discount}</td>
            </tr>
            <tr>
                <th  style="font-weight: bold;  border: 1px solid black;padding: 10px;text-align: start;"><strong>Total</strong></th>
                <th  style="font-weight: bold;  border: 1px solid black;padding: 10px;text-align: end;"><strong>${total}</strong></th>
            </tr>
        </table>
        <div style="padding:10px;margin-top:20px;">
        <p style='color:red' >If you did not authorize this transaction,please report it immediately by calling +91 1234567890 or mail us at zigmabank@gmail.com</p>
            <p>Warm Regards,</p>
            <img style="width:24%;height:auto" src="https://res.cloudinary.com/dvmkt80vc/image/upload/v1719315184/titleZIGMA-removebg-preview_gdrxg4.png" ></img>
            <p>
              <strong>ZIGMA BANK</strong>
            </p>
            <p></p>
            <p>zigmabank@gmail.com</p>
            <p>
              <i>
                This is an automated message. Please do not reply to this email.
              </i>
            </p>
          </div>
    </div>
    </div>
      `
    
      sendRechargeslip(mailbody)
}

module.exports = sendPaymentReceiptMail