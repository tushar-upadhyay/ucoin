# A Simple implementation of Cryptocurrency using node.js

This is a complete implemention of blockchain based crypocurrency using nodejs and react as front end

<b>Demo Link : <a href="https://ucointest.herokuapp.com">https://ucointest.herokuapp.com</a></b>

>>Use following test accounts to check the demo

>>>email:tusharrockpg@gmail.com<br>
  password:tushar

>>>email:tupadhyayxyz@gmail.com<br>
password:tushar

### APIS
> /auth/registerUser

> /auth/login

> /auth/logout

> /auth/verify

> /auth/resetPassword

> /mine
>> For Mining the new transactions (expects minerAddress param)

> /blockchain
>> returns complete blockchain as JSON

> /getTransactions 
>> returns transactions (auth required)

> /getBalance
>> returns balance (auth required)
## Installation

Run the following commands
```bash
git clone https://github.com/tushar-upadhyay/ucoin.git
cd ucoin
npm install
```
Create a .env file inside the root directory and paste the following code 
```bash
GMAIL_USERNAME = Your Gmail Account
PASSWORD = Gmail Account Password
JWT_SECRET = Set a unique string 
SESSION_SECRET = Set a unique string 
NODE_ENV = developement
MONGO_URL = <Your Mongo DB url>
```
## Important
<b>For using gmail account you have to enable less secure apps access <br> You can do that by visiting <a href="https://myaccount.google.com/u/1/lesssecureapps?pageId=none">This Link</a>

## Running the server

```bash
npm start
```
Now you can visit http://localhost:3001
