var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
let key,privateKey,pub,publicKey;
function genKeyPair(){
    key = ec.genKeyPair();
    privateKey = key.getPrivate('hex');
    publicKey = key.getPublic('hex');
    return {key,privateKey,publicKey};
}
function genKeyFromPrivateKey(privateKey){
    key = ec.keyFromPrivate(privateKey);
    pub = key.getPublic('hex');
    return {key,pub};
}
module.exports = {genKeyPair,genKeyFromPrivateKey};