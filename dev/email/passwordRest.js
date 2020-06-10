var jwt = require('jsonwebtoken');
var transporter = require('./transporter');
var {resetLink} = require('./urls');
module.exports = function sendForgetPasswordEmail(email,success,error){
var token = jwt.sign({email}, process.env.JWT_SECRET,{expiresIn:'5m'});
console.log('token',token)
// let url = process.env.NODE_ENV=="development"?"http://localhost:3000":"https://ucointest.herokuapp.com";
let link = `${resetLink}?token=${token}`
const mailOptions = {
    from: 'naukrialertshelp@gmail.com',
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
