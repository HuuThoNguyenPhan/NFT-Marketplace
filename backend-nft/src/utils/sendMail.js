const nodeMailer = require("nodemailer");

const sendMail = async (options) => {
    const transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: "outsourcetruyenchu@gmail.com",
        pass: "pxcdtkycdxrvzgtj",
      },
    });
  
    const mailOptions = {
      from: "outsourcetruyenchu@gmail.com",
      to: options.email,
      subject: options.subject,
      text: options.message,
    };
  
    await transporter.sendMail(mailOptions);
  };
  
  module.exports = sendMail;