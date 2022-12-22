const nodemailer = require("nodemailer");
const path = require("path");
const { htmlToText } = require("html-to-text");
const pug = require("pug");
class Email {
  constructor(user, otp) {
    this.to = user.email.emailId;
    this.otp = otp;
    this.name = `${user.firstName} ${user.lastName}`;
    this.from = "aaoochale@gmail.com"; //process.env.EMAIL_FROM;
  }
  newTransporter() {
    return nodemailer.createTransport({
      service: "gmail",
      secureConnection: false,
      port: 3000, //  process.env.EMAIL_PORT |
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
      }, // true
      auth: {
        user: "aaoochale@gmail.com", // process.env.EMAIL_FROM,
        pass: "wodqckbohyzkboae",
      },
      from: "aaochale@gmail.com", // process.env.EMAIL_FROM, // aaochale.gmail.com,
    });
  }
  async send(subject, body) {
    const html = pug.renderFile(path.join(__dirname, "..", "views", "emailVerification.pug"), {
      otp: this.otp,
      body: body,
    });
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: this.to,
      subject: `AAOOCHALE`,
      html: html,
      text: "Hello. This email is for your email verification.",
    };
    await this.newTransporter().sendMail(mailOptions, function (error, info) {
      if (error) {
        throw error;
      }
    });
  }
}
module.exports = Email;
