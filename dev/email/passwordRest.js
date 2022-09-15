const jwt = require('jsonwebtoken');
const transporter = require('./transporter');
const {resetLink} = require('./urls');
module.exports = function sendForgetPasswordEmail(email,success,error){
    console.log('i ran')
const token = jwt.sign({email}, process.env.JWT_SECRET,{expiresIn:'5m'});

// let url = process.env.NODE_ENV=="development"?"http://localhost:3000":"https://ucointest.herokuapp.com";
let link = `${resetLink}?token=${token}`
const mailOptions = {
    from: 'tusharrockpg@gmail.com',
    to: email,
    subject: 'Verify Email',
    html:`
        <h2>Hello Greetings from UCOIN</h2><br>
        <h2>
         We have Recieved a Password Reset Request 
        </h2>
        <p>Reset password by clicking <a href="${link}">Here</a>
        <br>
        <p>If you didn't make this request ignore this..</p>
    `
    };
transporter.sendMail(mailOptions, function(err, info){
    if (err) {
        console.error(err);
    } else {
        console.log('success')
        success(info);
    }
});
}
