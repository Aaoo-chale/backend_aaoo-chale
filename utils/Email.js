// const nodemailer = require("nodemailer");
// const path = require("path");
// const { htmlToText } = require("html-to-text");
// const pug = require("pug");

// class Email {
//   constructor(user, otp) {
//     this.to = user.email.emailId;
//     this.otp = otp;
//     this.name = `${user.firstName} ${user.lastName}`;
//     this.from = process.env.EMAIL_FROM;
//   }

//   newTransporter() {
//     return nodemailer.createTransport({
//       // host: process.env.EMAIL_HOST,
//       // port: process.env.EMAIL_PORT,
//       // auth: {
//       //   user: process.env.EMAIL_MAILTRAP_FROM,
//       //   pass: process.env.EMAIL_MAILTRAP_PASS,
//       // },

//       // service: "hotmail",
//       host: process.env.EMAIL_HOST,
//       secureConnection: false,
//       port: process.env.EMAIL_PORT,
//       tls: {
//         ciphers: "SSLv3",
//         rejectUnauthorized: false,
//       },
//       auth: {
//         user: process.env.EMAIL_FROM,
//         pass: `Thakur@123@#`,
//       },
//       from: process.env.EMAIL_FROM,
//     });
//   }

//   async send(subject, body) {
//     const html = pug.renderFile(path.join(__dirname, "..", "views", "emailVerification.pug"), {
//       otp: this.otp,
//       body: body,
//     });
//     const mailOptions = {
//       from: process.env.EMAIL_FROM,
//       to: this.to,
//       subject,
//       html: html,
//       text: "Hello. This email is for your email verification.",
//     };
//     await this.newTransporter().sendMail(mailOptions, function (error, info) {
//       if (error) {
//         throw error;
//       }
//     });
//   }
// }
// module.exports = Email;
