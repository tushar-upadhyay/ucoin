var {Router} = require('express');
var express =require('express')
var path = require('path')
var Blockchain = require("../blockchain");
const verifyTransaction = require('../wallet/verifyTransaction');
let Wallet = require('../wallet/wallet');
let UserModel = require('./models/userModel');
let bcrypt = require('bcryptjs');
const router = Router();
const bitcoin = new Blockchain();
router.get("/blockchain",(req,res)=>{
    res.send(bitcoin);
})

router.post('/generateTxn',async(req,res)=>{
    if(!req.session.email){
        return res.json({'auth':'failed'})
    }
    const {password,amount,recipient,receiver,sendername} =req.body;
    if(amount<=0 || !amount){
        return res.json({'error':'Amount cannot be 0'})
    }
    console.log('email',req.session.email,password)
    try{
        let user = await UserModel.findOne({email:req.session.email});
            bcrypt.compare(password,user.password,(err,success)=>{
                if(success){
                    let sender = user.publicKey;
                    let wallet = new Wallet(user.privateKey,sender);
                    if(bitcoin.getBalanceFromAddress(sender)<amount){
                         return res.json({
                            "error":"You does not have Enough Funds!"
                            })
                    }
                    try{
                       return res.json(wallet.makeTransaction({amount:amount,recipient:recipient,receiver,sendername}));
                     }
                    catch(err){
                        res.json({
                        "error":"something went wrong"
                            })
                    }
                }
                else{
                    res.json({"error":"Password Invalid"})
                }
            });
           
            
    }
    catch(err){
        res.send({"error":"err"})
    }
    
})
router.get('/getTransactions',async(req,res)=>{
    let email = req.session.email;
    if(!email){
        return res.json({'auth':'failed'})
    }
    try{
        let user = await UserModel.findOne({email:req.session.email});
        if(user){
           let response =  JSON.stringify(bitcoin.getTransactions(user.publicKey));
            res.json(response)
        }
        else{
            res.json({'auth':'failed'})
        }
    }
    catch(err){
        res.json({'error':'some error occured'})
    }
})
router.get('/getWallet',(req,res)=>{
  let wallet = new Wallet();
  res.json(wallet.getKeys())
})
router.post("/transaction",(req,res)=>{
    const newTransaction = req.body;
    let blockIndex  = bitcoin.addTransactionToPendingTransaction(newTransaction);
    res.json({'note':`transaction will be added to block ${blockIndex}`})
})
router.post('/register-broadcast-transactions',(req,res)=>{
    const {amount,sender,recipient,signature,receiver,sendername} = req.body;
    if(!verifyTransaction(req.body,bitcoin.getBalanceFromAddress(sender))) res.json({"error":"Transaction is invaid"});
    else{
        const newTransaction = bitcoin.createTransation(amount,sender,recipient,signature,receiver,sendername);
        bitcoin.addTransactionToPendingTransaction(newTransaction);
        let promises = [];
        bitcoin.networkNodes.forEach(networkNodes=>{
            const data = {
                uri:networkNodes + "/transaction",
                body:newTransaction,
                method:'POST',
                json:true
            }
            promises.push(rp(data))
        })
        Promise.all(promises)
        .then(data=>{
            res.json({'sent':'Money sent!'})
        })
    }
})
router.post('/getBalance',(req,res)=>{
    if(!req.session.email){
        return  res.json({'auth':'failed'})
    }
    let address = req.body['address']
    console.log(req.body)
    let balance = bitcoin.getBalanceFromAddress(address);
    res.json({
        "Balance":balance
    })
})
router.post("/mine",(req,res)=>{
    let lastBlock = bitcoin.getLastBlock();
    let previousHash = lastBlock['hash'];
    let currentBlock = bitcoin.pendingTransactions;
    const nounce = bitcoin.mine(previousHash,currentBlock);
    const hash = bitcoin.hash(previousHash,currentBlock,nounce);
    let newBlock = bitcoin.createNewBlock(nounce,previousHash,hash);
    let minerAddress = req.query.minerAddress; 
    bitcoin.pendingTransactions.push({
        "sender":null,
        "amount":100,
        "recipient":minerAddress,
        "timestamp":(new Date()).toString()
    })
    let promises  = [];
    for(let networkNode of bitcoin.networkNodes){
        const data = {
            uri:networkNode + '/createnewblock',
            method:'POST',
            json:true,
            body:newBlock 
        }
        promises.push(rp(data));
    }
    Promise.all(promises)
    .then(data=>{
        promises = [];
        for(let networkNode of bitcoin.networkNodes){
            const data = {
                uri:networkNode + '/transaction',
                method:'POST',
                body:{
                    "sender":null,
                    "amount":100,
                    "recipient":minerAddress
                },
                json:true
            }
            promises.push(rp(data))
        }
        
        return Promise.all(promises)    })
    .then(re=>{
        res.json({
            'note':'block broadcasted'
        })
    })
    // res.send('success')
})
router.post('/createnewblock',(req,res)=>{
    let newBlock =   req.body;
    bitcoin.pendingTransactions = [];
    bitcoin.chains.push(newBlock);
    
    res.send("Block mined and broadCasted")
})
router.post("/register-and-broadcast-node",(req,res)=>{
    let newNodeUrl = req.body.newNodeUrl;
    if(newNodeUrl){
    if(bitcoin.networkNodes.indexOf(newNodeUrl)==-1 &&(bitcoin.currentNodeUrl != newNodeUrl)) bitcoin.networkNodes.push(newNodeUrl);
    const regNodesPromise = [];
    bitcoin.networkNodes.forEach(networkNodeUrl =>{
        const requestOptions = {
            uri:networkNodeUrl + '/register-node',
            method:'POST',
            body:{newNodeUrl:newNodeUrl},
            json:true
        }
        regNodesPromise.push(rp(requestOptions));
    })
    Promise.all(regNodesPromise)
    .then(data => {
        const bulkRegisterOptions = {
            uri:newNodeUrl + '/register-nodes-bulk',
            method:'POST',
            body:{allNetworkNodes:[...bitcoin.networkNodes,bitcoin.currentNodeUrl],pendingTransactions:bitcoin.pendingTransactions},
            json:true
        };
        return rp(bulkRegisterOptions);
    })
    .then(data => {
        res.json({note:'New node regsitered successfully'})
    })
}
else{
    res.json({"note":"enter valid node address"})
}
})
router.post("/register-node",(req,res)=>{
    const newNodeUrl = req.body.newNodeUrl;
    const notCurrentNode = bitcoin.currentNodeUrl != newNodeUrl
    if(bitcoin.networkNodes.indexOf(newNodeUrl)==-1 && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
    res.json({'note':'new Node registered successfully with node'})
})
router.post("/register-nodes-bulk",(req,res)=>{
    const allNetworkNodes = req.body.allNetworkNodes;
   // bitcoin.pendingTransactions = req.body.pendingTransactions;
    allNetworkNodes.forEach(networkNodeUrl => {
        const notAlreadyPresent =  bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = bitcoin.currentNodeUrl != networkNodeUrl;
        if(notAlreadyPresent && notCurrentNode){
            bitcoin.networkNodes.push(networkNodeUrl);
        }
    })
    res.json({'note':'Node Added'})
})


module.exports = router;