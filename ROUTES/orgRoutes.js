const router = require('express').Router()
const sendPayrollMail = require('../EmailServiceModule/PaymentSalaryMail')
const multer = require("multer")
const XLSX = require("xlsx")
const storage = multer.memoryStorage()
const upload = multer({storage:storage})
var salaryData = []
const sendOtp = require("../EmailServiceModule/PaymentOtpService")
const sendPayrollVerificationMail = require("../EmailServiceModule/PayrollOtpMail")
const organisation = require("../MODELS/Organisation")
const orgTxn = require("../MODELS/OrgTransaction")
const User = require("../MODELS/User")
const revenueMail = require("../EmailServiceModule/SendRevenueBalMailDebit")
const Transaction = require('../MODELS/Transaction')
var OrgTransaction = []
const sendSalaryToemployee = async (empdata,org,zigma)=>{
    const emp = await User.findOne({Account_id : empdata.Account_id })
    emp.Balance += empdata.NetPay
    org.Revenue -= empdata.NetPay
    zigma.revenue += empdata.IncomeTax
    await emp.save()
    await org.save()
    await zigma.save()
    const emptransaction = new orgTxn({
        SenderAccountId : org.Account_id,
        ReceiverAccountId : empdata.Account_id,
        Salary : empdata.NetPay,
        BaseSalary : empdata.BasicSalary,
        HRA : empdata.HRA,
        LTA : empdata.LTA,
        Bonus : empdata.Bonus,
        PF : empdata.PF,
        Status : "Success",
        TransactionType : "Credit"
    })
    OrgTransaction = await emptransaction.save()
    await sendPayrollMail(emptransaction,empdata.Email,empdata.Name)

    console.log(`Rs ${empdata.NetPay} is credited to ${empdata.Name} bearing ac no ${empdata.Account_id}`)
}

router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    try {
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
      console.log(jsonData);
      salaryData = jsonData;
      console.log("the salary data is ", salaryData)
      res.send(jsonData);
    } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).send('Error processing file.');
    }
  });
  
  router.post('/sendSalary', async(req, res) => {
const org =await organisation.findOne({Account_id:"ZBKINORG000333"})
const zigma = await organisation.findOne({Account_id:"ZBKINORG000322"})
    
    // console.log(`Performing transaction for account ${accountid} with amount ${amount}`);
    for(var i=0;i<salaryData.length;i++)
    {
        console.log(`Performing transaction for account ${salaryData[i].Account_id} with amount ${salaryData[i].NetPay}`);
        // await sendSalaryToemployee(salaryData[i],org,zigma)
        console.log(`Transaction ${i+1} is Successful`)
        const totalSalary = salaryData.reduce((acc, row) => acc + (row.NetPay || 0), 0);
        const availableRevenuBal = org.Revenue
        const debitTransaction = {
            total : totalSalary,
            balance:availableRevenuBal,
            TransactionId : OrgTransaction._id
        }
        await revenueMail(debitTransaction)
    }
    res.send({ success: true, message: 'Transaction successful.' });
  });

  router.get("/sendOrgOtp/:amount",async (req,res)=>{
    const email = "gantamohan.556@gmail.com"
    const amt = req.params.amount
    const otp = await sendPayrollVerificationMail(amt)
    res.send({"otp":String(otp)})
  })
  module.exports = router