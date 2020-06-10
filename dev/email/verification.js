const transporter = require('./transporter');
var jwt = require('jsonwebtoken');
let {verificationLink} = require('./urls');
module.exports = function sendVerification(email,success,error){
var token = jwt.sign({email}, process.env.JWT_SECRET,{expiresIn:'1h'});
let link = `${verificationLink}?token=${token}`
const mailOptions = {
    from: 'naukrialertshelp@gmail.com',
    to: email,
    subject: 'Verify Email',
    html:`
        <h2>Hello thanks for using Ucoin..</h2><br>
        <p>Please Verify Your email address by clicking <a href="${link}">Here</a>
        <br>
        <p>If you didn't make this request ignore this..</p>
    `
    };
transporter.sendMail(mailOptions, function(err, info){
    if (err) {
        error(err);
    } else {
        success(info);
    }
});
}
