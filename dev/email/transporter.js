const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport')
const auth = {
    auth:{
        api_key:process.env.API_KEY_MAILGUN,
        domain:process.env.DOMAIN
    }
}


const transporter = nodemailer.createTransport(mg(auth));
module.exports = transporter;