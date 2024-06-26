const mailSender = require("./MailService")
const sendNewRegistrationMail =(newUser)=>{
    const newUserRegistration = async (mailbody) => {
        const info = await mailSender.sendMail({
          from: "zigmabank@gmail.com",
          to: "zigmabank@gmail.com",
          subject: "New Account Registration",
          html: mailbody,
        })
        console.log("mail sent", info.response)
      }
    
            firstname = newUser.FirstName
            lastname  = newUser.LastName
            mobileno = newUser.MobileNumber
            email = newUser.Email
            state = newUser.State
            city = newUser.City
            code =  newUser.Pincode
            country = newUser.Country
            aadhar = newUser.Aadhar
            pan =  newUser.Pan
            approvallink = "http://localhost:3000/adminroutes/approve/"+newUser._id
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
            <a style='margin:2px 10px;border:1px solid black;background-color:#28376e;padding:5px;color:white;text-decoration:none;' href=${approvallink}>Approve Registration</a>
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