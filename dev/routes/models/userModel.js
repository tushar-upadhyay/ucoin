var {Schema,model} =   require("mongoose");
const userSchema =  Schema({
    name:String,
    email:String,
    password:String,
    publicKey:String,
    privateKey:String,
    verified:String
})
module.exports = model('Data',userSchema);
