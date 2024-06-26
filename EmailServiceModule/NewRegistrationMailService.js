const mailSender = require("./MailService")
const sendNewRegistrationMail =(userdata)=>{
    const newUserRegistration = async (mailbody) => {
        const info = await mailSender.sendMail({
          from: "teamzigmabank04@gmail.com",
          to: "gantamohan.556@gmail.com",
          subject: "New Account Registration",
          html: mailbody,
        })
        console.log("mail sent", info.response)
      }
      const username = "Mohan Ganta"
      const firstname = 'Monkey D Luffy'
      const lastname = 'Pirate King'
      const email = 'luffy@gmail.com'
      const mobileno = '0000000'
      const city = 'skull island'
      const state = 'Laughtale'
      const code = '12029'
      const country = 'East Blue'
      const aadhar = "https://www.google.com/imgres?q=luffy%20identity%20card&imgurl=https%3A%2F%2Fi.pinimg.com%2F736x%2F3c%2F89%2F5e%2F3c895e01bf18ebd53840b066cce43df5.jpg&imgrefurl=https%3A%2F%2Fin.pinterest.com%2Fpin%2Fliffy-card--614108099193683798%2F&docid=1fmr5h4sN49WvM&tbnid=JLih-cgLmjXWfM&vet=12ahUKEwi9lP2e6u6GAxWFUGwGHRwSCdgQM3oECBUQAA..i&w=735&h=466&hcb=2&ved=2ahUKEwi9lP2e6u6GAxWFUGwGHRwSCdgQM3oECBUQAA"
      const pan = "https://www.google.com/imgres?q=luffy%20identity%20card&imgurl=https%3A%2F%2Fi.pinimg.com%2F736x%2F3c%2F89%2F5e%2F3c895e01bf18ebd53840b066cce43df5.jpg&imgrefurl=https%3A%2F%2Fin.pinterest.com%2Fpin%2Fliffy-card--614108099193683798%2F&docid=1fmr5h4sN49WvM&tbnid=JLih-cgLmjXWfM&vet=12ahUKEwi9lP2e6u6GAxWFUGwGHRwSCdgQM3oECBUQAA..i&w=735&h=466&hcb=2&ved=2ahUKEwi9lP2e6u6GAxWFUGwGHRwSCdgQM3oECBUQAA"
    
      const mailbody = `
    <div>
          <img
            style="width:100%;height:auto;margin-bottom:4px"
            src="https://res.cloudinary.com/dvmkt80vc/image/upload/v1718962948/WhatsApp_Image_2024-06-21_at_3.02.53_PM_fvdozr.jpg"
            alt="vts-banner-image"
          ></img>
          <h1>New Account Registration</h1>
          <div>
            <p>
              A New Candidate has registered for the <strong>ZIGMA BANK</strong> Account credentials. Below are the details:
            </p>
            <h2>Applicant Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td
                  colspan="4"
                  style="text-align: center;  border: 1px solid black;"
                >
                  <h4>ZIGMABANK</h4>
                  <p>Applicant Registration Form</p>
                </td>
              </tr>
              <tr>
                <th style="border: 1px solid black; padding: 7px 4px; background-color: #f2f2f2;">
                  Firstname
                </th>
                <td style="border: 1px solid black; padding: 7px 4px;">${firstname}</td>
                <th style="border: 1px solid black; padding: 7px 4px; background-color: #f2f2f2;">
                  Lastname
                </th>
                <td style="border: 1px solid black; padding: 7px 4px;">${lastname}</td>
              </tr>
              <tr>
                <th style="border: 1px solid black; padding: 7px 4px; background-color: #f2f2f2;">
                  Mobile No
                </th>
                <td style="border: 1px solid black; padding: 7px 4px;">${mobileno}</td>
                <th style="border: 1px solid black; padding: 7px 4px; background-color: #f2f2f2;">
                  Email
                </th>
                <td style="border: 1px solid black; padding: 7px 4px;">${email}</td>
              </tr>
              <tr>
                <th style="border: 1px solid black; padding: 7px 4px; background-color: #f2f2f2;">
                  City/District
                </th>
                <td style="border: 1px solid black; padding: 7px 4px;">${city}</td>
                <th style="border: 1px solid black; padding: 7px 4px; background-color: #f2f2f2;">
                  State
                </th>
                <td style="border: 1px solid black; padding: 7px 4px;">${state}</td>
              </tr>
              <tr>
                <th style="border: 1px solid black; padding: 7px 4px; background-color: #f2f2f2;">
                  Pincode
                </th>
                <td style="border: 1px solid black; padding: 7px 4px;">${code}</td>
                <th style="border: 1px solid black; padding: 7px 4px; background-color: #f2f2f2;">
                  Country
                </th>
                <td style="border: 1px solid black; padding: 7px 4px;">${country}</td>
              </tr>
              <tr>
                <th style="border: 1px solid black; padding: 7px 4px; background-color: #f2f2f2;">
                  Aadhar
                </th>
                <td style="border: 1px solid black; padding: 7px 4px;"><a style='border:1px solid black;background-color:#28376e;padding:4px 8px;color:white;text-decoration:none;' href=${aadhar}>Open</a></td>
                <th style="border: 1px solid black; padding: 7px 4px; background-color: #f2f2f2;">
                  PAN
                </th>
                <td style="border: 1px solid black; padding: 7px 4px;"><a style='border:1px solid black;background-color:#28376e;padding:4px 8px;color:white;text-decoration:none;' href=${pan}>Open</a></td>
              </tr>
            </table>
            <div style='text-align:center;margin-top:15px'>
            <a style='margin:2px 10px;border:1px solid black;background-color:#28376e;padding:5px;color:white;text-decoration:none;' href='www.google.com'}>Approve Registration</a>
            </div>
          </div>
          <div style="padding:10px;margin-top:20px;">
            <p>teamzigmabank@suppport,</p>
            <p>
              <strong>ZIGMA BANK</strong>
            </p>
            <p>
              <i>
                This is an automated message. Please do not reply to this email.
              </i>
            </p>
          </div>
        </div>
    `
    
    newUserRegistration(mailbody)
}

module.exports = sendNewRegistrationMail