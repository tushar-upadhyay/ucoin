var sha256 = require('sha256');
const uuid = require('uuid/v1')
const Transaction = require('./transaction');
class Blockchain{
    constructor(){
        this.chains = [];
        this.pendingTransactions = [];
        let firstBlock = {
            index:1,
            hash:'0',
            transactions:[],
            nounce:100,
            timestamp:(new Date()).toString(),
            previousBlockHash:'0'
        }
        this.chains.push(firstBlock);
        this.currentNodeUrl = process.argv[3];
        this.networkNodes = [];
    }
    createNewBlock(nounce,previousBlockHash,hash){
        const newBlock = {
            index:this.chains.length+1,
            timestamp:(new Date()).toString(),
            hash:hash,
            previousBlockHash:previousBlockHash,
            transactions:this.pendingTransactions,
            nounce:nounce
        }
        this.pendingTransactions = [];
        this.chains.push(newBlock);
        return newBlock;
    }
    isValidTransaction(){
        for(let block of this.chains){
            for(let transaction of block['transactions']){
                if(!transaction.isValid()){
                    return false;
                }
            }
        }
        return true;
    }
    createTransation(amount,sender,recipient,signature,receiver,sendername){
        return {
            amount:amount,
            sender:sender,
            sendername,
            recipient:recipient,
            signature:signature,
            receiver,
            timestamp:(new Date()).toString(),
            transactionId:uuid()
        } 
    }
    addTransactionToPendingTransaction(transactionData){
        this.pendingTransactions.push(transactionData);
        return this.chains.length+1;
    }
    getLastBlock(){
        return this.chains[this.chains.length-1];
    }
    hash(previousBlockHash,currentBlockData,nounce){
        let hash = previousBlockHash + JSON.stringify(currentBlockData) + nounce.toString();
        return sha256(hash);
    }
    getBalanceFromAddress(address){
        let balance = 0;
        for(let block of this.chains){
            for(let transaction of block.transactions){
                if(transaction.sender==address){
                    balance-=parseFloat(transaction.amount);
                }
                if(transaction.recipient == address){
                    balance+=parseFloat(transaction.amount);
                }
            }
        }
        for(let transaction of this.pendingTransactions){
            if(transaction.sender==address){
                balance-=parseFloat(transaction.amount);
            }
        }
        return balance;
    }
    mine(previousBlockHash,currentBlockData){
        let nounce = 0;
        let hash = this.hash(previousBlockHash,currentBlockData,nounce)
        while(hash.substring(0,4)!="0000"){
            hash = this.hash(previousBlockHash,currentBlockData,++nounce);
        }
        return nounce;
    }
    getTransactions(address){
        let response = [];
        for(let block of this.chains){
            for(let transaction of block.transactions){
                if(transaction.sender==address){
                    let {amount,timestamp,receiver} = transaction; 
                    response.push({
                        type:'sent',
                        data:{amount,timestamp,name:receiver}
                    })
                }
                if(transaction.recipient == address){
                    let {amount,timestamp,sendername} = transaction; 
                    if(!sendername){
                        sendername = 'Mining Reward'
                    }
                    response.push({
                        type:'received',
                        data:{amount,timestamp,name:sendername}
                    })
                }
            }
        }
        for(let transaction of this.pendingTransactions){
            if(transaction.sender==address){
                let {amount,timestamp,receiver} = transaction; 
                    response.push({
                        type:'pending',
                        data:{amount,timestamp,name:receiver}
                    })
            }
        }
        return response.reverse()
    }
    isBlockValid(){
        for(let i=1;i<this.chains.length;i++){
            if(this.chains[i].hash!=this.chains[i+1]['previousHash']){
                return false;
            }
            if(this.chains[i].hash !=this.hash(this.chains[i])){
                return false;
            }
        }
        return this.isValidTransaction();
    }
}
module.exports = Blockchain