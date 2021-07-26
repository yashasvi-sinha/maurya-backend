const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    // host: process.env.EMAIL_HOST,
    host: "smtp.gmail.com",
    // port: process.env.EMAIL_PORT,
    port: process.env.GMAIL_PORT,
    auth: {
      // user: process.env.EMAIL_USERNAME,
      user: process.env.GMAIL_ADDRESS,
      // pass: process.env.EMAIL_PASSWORD,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "no-reply@AttainU <attainu@gmail.com>",
    to: options.email,
    subject: options.subject,
    html: options.message,
    //html
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
