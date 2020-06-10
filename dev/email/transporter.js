const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const transporter = nodemailer.createTransport(smtpTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.PASSWORD // naturally, replace both with your real credentials or an application-specific password
    }
}));
module.exports = transporter;