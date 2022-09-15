let baseURL = process.env.NODE_ENV=='development'?'http://localhost:3001/':'https://ucoin-test.herokuapp.com/'
let resetLink = baseURL + 'resetPassword'
let verificationLink = baseURL + 'auth/verify'
module.exports = {baseURL,resetLink,verificationLink};