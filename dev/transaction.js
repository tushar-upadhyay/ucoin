const sha256 = require('sha256');
var EC = require("elliptic").ec;
var ec = new EC('secp256k1');
module.exports = class Transaction{
    constructor(amount,sender,recipient,receiver,sendername){
        this.sender = sender;
        this.recipient = recipient;
        this.amount = amount;
        this.receiver = receiver;
        this.sendername = sendername;
    }
    hashTransaction(){
        return sha256(this.amount + this.sender + this.recipient + this.receiver + this.sendername).toString();
    }
    signTransaction(signKey){
        if(signKey.getPublic('hex') !== this.sender) throw new Error('You cannot sign for others');
        this.hashTx = this.hashTransaction();
        const sig = signKey.sign(this.hashTx,'base64');
        this.signature = sig.toDER('hex');
    }
    isValid(){
        if(this.sender === null) return true;
        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature')
        }
        
        const publicKey = ec.keyFromPublic(this.sender,'hex');
        return publicKey.verify(this.hashTransaction(),this.signature);
    }
}