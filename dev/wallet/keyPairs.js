let Wallet = require('./wallet');
let wallet = new Wallet('3be2c198ee4ef81f15575bf42ada759e6d774b0f8faff3756ed6f32d4d62db8f','04cc6b7659e7169f39e8df542725ebd8015eab228a36aab2cd273df83b10daee0399beffa479edbf395a615f338baa6878f3623e0946f31b8cec4c1b06af7f73e3');
console.log(JSON.stringify(wallet.makeTransaction({amount:10,recipient:'TUY'})))