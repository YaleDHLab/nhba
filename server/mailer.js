// mailer.js
var nodemailer = require("nodemailer");
var config = require("../config");

var account = {
  user: process.env["NHBA_EMAIL"],
  password: process.env["NHBA_EMAIL_PASSWORD"],
  address: process.env["NHBA_EMAIL"] + "@gmail.com"
};

var mail = {
  string:
    "smtps://" +
    account.user +
    "%40gmail.com:" +
    account.password +
    "@smtp.gmail.com",
  fromAddress: '"NHBA WEB 👥 " <' + account.address + ">",
  toAddress: account.address,
  subject: "NHBA Account Validation",
  text: "Please click the following link to validate your account: ",
  html: "Please click the following link to validate your account: "
};

var transporter = nodemailer.createTransport(mail.string);

module.exports = {
  send: function(emailAddress, token, params) {
    var link = config.api.protocol + "://";
    link += config.api.host + ":";
    link += config.api.port + "/";
    link += "?token=" + token;
    link += "&email=" + emailAddress;
    if (params) {
      link += params;
    }

    var mailOptions = {
      from: mail.fromAddress, // sender address
      to: emailAddress, // list of receivers
      subject: mail.subject, // subject line
      text: mail.text + link, // plaintext body
      html: mail.html + link // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.warn(error);
      }
      console.log("Message sent: " + info.response);
    });
  }
};
