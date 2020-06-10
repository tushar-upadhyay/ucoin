const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const sha256 = require('sha256');


module.exports = function isTransactionValid(transaction,balance){
    console.log('iran')
    if(transaction.sender === null) return true;
    console.log('t')
    if(transaction.amount>balance) return false;
    console.log(balance)
    if(!transaction.signature || transaction.signature.length === 0) return false;
    console.log('t')
    const hash = sha256(transaction.amount + transaction.sender + transaction.recipient +transaction.receiver + transaction.sendername).toString()
    const publicKey = ec.keyFromPublic(transaction.sender,'hex');
        return publicKey.verify(hash,transaction.signature);
}
