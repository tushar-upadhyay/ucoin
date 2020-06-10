var generateKeys = require('./generateKeys');
var Transaction = require('../transaction');
module.exports = class Wallet{
    constructor(privateKey,publick){
        if(privateKey){
            let {key,pub} = generateKeys.genKeyFromPrivateKey(privateKey);
            this.key = key;
            this.privateKey = privateKey;
            this.publicKey = pub;
            this.suppliedPublicKey =publick
        }
        else{
            let {key,privateKey,publicKey} = generateKeys.genKeyPair();
            this.key = key;
            this.privateKey = privateKey;
            this.publicKey = publicKey;
        }
    }
    getKeys(){
        return {privateKey:this.privateKey,publicKey:this.publicKey,registered:'ok'};
    }
    balance(blockchain){
        let balance = 0;
        for(let block of blockchain.chains){
            for(let transaction of block.transactions){
                if(transaction.sender==blockchain.publicKey){
                    balance-=transaction.amount;
                }
                if(transaction.recipient == blockchain.publicKey){
                    balance+=transaction.amount;
                }
            }
        }
        for(let pendingTransaction of blockchain.pendingTransactions){
            if(pendingTransaction.sender==blockchain.publicKey){
                balance-=transaction.amount;
            }
        }
        return balance;        
    }
    makeTransaction({amount,recipient,receiver,sendername}){
        if(this.suppliedPublicKey!=this.publicKey){
            return {
                "error":"invalid key"
            }
        }
        let transaction = new Transaction(amount,this.publicKey,recipient,receiver,sendername);
        transaction.signTransaction(this.key);
        if(!transaction.isValid()) throw new Error('Some Error Occured!');
        return transaction;
     }
}
