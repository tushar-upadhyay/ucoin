var Blockchain = require("./blockchain");
let bitcoin = new Blockchain();
bitcoin.createTransation(100,'FJKGHSGOIU3287K','IRYGHS689623');
let currentBlockData = [
    {
        amount:101,
        sender:'HIUDFG8Y80913',
        recipient:'HDSFH8Y89Y8'
    }
]
let nounce = bitcoin.mine('FJKGHSGOIU3287K',currentBlockData);
let hash = bitcoin.hash('FJKGHSGOIU3287K',currentBlockData,nounce);
bitcoin.createNewBlock(nounce,'FJKGHSGOIU3287K',hash);
console.log(bitcoin);