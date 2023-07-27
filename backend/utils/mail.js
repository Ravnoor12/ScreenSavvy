const nodemailer = require('nodemailer');
// for email verification
exports.generateOTP = (otp_length=6)=>{
    let OTP = '';
    for(let i=0;i<otp_length;i++){
        const randomval = Math.round(Math.random()*9);
        OTP+=randomval;
    }
    return OTP;
}


exports.generateMailTransporter = () =>{ 
    var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASS
    }
  });
  return transport;
}