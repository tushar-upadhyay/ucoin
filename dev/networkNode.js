var express = require('express')
var proxy = require('http-proxy-middleware');
const mongoose = require("mongoose");
require('dotenv').config()
var path = require('path')
var cookieParser = require('cookie-parser')
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var blockchainRoutes = require("./routes/blockchain");
var authroutes = require("./routes/auth");
const cors = require('cors');
let port = process.argv[2];
var app = express();
const maxAge = 2*60*60*60*1000;
// mongodb://localhost:27017/myappy
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true});
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(cookieParser())
app.use(session({
    resave:false,
    name:'exp_session',
    secret:process.env.SESSION_SECRET,
    saveUninitialized:false,
    store:new MongoStore({mongooseConnection:mongoose.connection}),
    cookie:{
        maxAge,
        httpOnly:false,
        secure:false
    }
}));
let db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',()=>{
    console.log('connected....')
})

app.use('/',blockchainRoutes);
app.use("/auth",authroutes);
app.use(express.static(path.join(__dirname,'../client/build')));
app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,'../client/build/index.html'))
})
// USE THIS IN DEVELOPEMENT SERVER OF REACT
// app.use(
//     '/',
//     proxy({ target: 'http://localhost:3000', changeOrigin: true })
//   );
app.listen(process.env.PORT || 3001)