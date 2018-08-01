// mailer.js
const nodemailer = require('nodemailer');
const config = require('../config');

const account = {
  user: process.env.NHBA_EMAIL,
  password: process.env.NHBA_EMAIL_PASSWORD,
  address: `${process.env.NHBA_EMAIL}@gmail.com`
};

const mail = {
  string: `smtps://${account.user}%40gmail.com:${
    account.password
  }@smtp.gmail.com`,
  fromAddress: `"NHBA WEB 👥 " <${account.address}>`,
  toAddress: account.address,
  subject: 'NHBA Account Validation',
  text: 'Please click the following link to validate your account: ',
  html: 'Please click the following link to validate your account: '
};

const transporter = nodemailer.createTransport(mail.string);

module.exports = {
  send(emailAddress, token, params) {
    let link = `${config.api.protocol}://`;
    link += `${config.api.host}:`;
    link += `${config.api.port}/`;
    link += `?token=${token}`;
    link += `&email=${emailAddress}`;
    if (params) {
      link += params;
    }

    const mailOptions = {
      from: mail.fromAddress, // sender address
      to: emailAddress, // list of receivers
      subject: mail.subject, // subject line
      text: mail.text + link, // plaintext body
      html: mail.html + link // html body
    };

    transporter.sendMail(mailOptions, error => {
      if (error) {
        console.warn(error);
      }
    });
  }
};
