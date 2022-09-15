var {Router} = require('express')
var bcrypt = require('bcryptjs')
var UserModel = require("./models/userModel");
var Wallet = require("../wallet/wallet");
var sendVerification = require("../email/verification");
var sendForgetPasswordEmail = require("../email/passwordRest");

var jwt = require('jsonwebtoken');
const router = Router();
redirectToLogin = (req,res,next)=>{
    if(!req.session.email){
        return res.json({"error":"you need to be logged in to see this resource"});
    }
    next();
}
redirectToDashboard = (req,res,next) =>{
    if(req.session.email){
        return res.json({"error":"already logged in"});
    }
    next();
}
router.post("/resendVerification",async(req,res)=>{
    let email = req.body.email;
    let password = req.body.password;
    if(email && password){
        try{
            let user = await UserModel.findOne({email});
            console.log(user)
            if(user){
                
                bcrypt.compare(password,user.password,(err,success)=>{
                    if(err){
                        res.json({'error':'some error occured'})
                    }
                    if(success){
                        if(user.verified=='false'){
                        sendVerification(email,()=>res.json({'msg':'sent'}),(err)=>res.json({'err':'some error ocuured'}));
                        }
                        else{
                            res.json({'error':'already verified'})
                        }
                    }
                    if(!success){
                        res.json({'error':'bad auth'})
                    }
                })               
            
            }
            else{
                res.json({'error':'email not registered'})
            }
        }
        catch(err){
            res.json({'error':'error occured'})
        }
        
    }
    else{
        res.json({'error':'some fields are missing'})
    }
    
})
router.post("/forgetPassword",async(req,res)=>{
    const email = req.body.email;
    console.log(email)
    try{
        let User = await UserModel.findOne({email})
        if(User){
            sendForgetPasswordEmail(email,()=>res.json({'msg':'Email sent!'}),()=>res.json({'error':'something went wrong'}));
        }
        else{
            res.json({'error':'user not found'})
        }
    }
    catch(err){
        res.send(User)
    }
    
    //sendVerification(email,()=>{},()=>{})

})
router.get('/checkAuth',(req,res)=>{
    if(!req.session.email){
        req.session.destroy();
        res.clearCookie('exp_session');
        res.clearCookie('publicKey')
         res.json({'auth':'failed'})
    }
    res.json({'auth':'success'})
    
})
redirectToError2 = (req,res,next)=>{
    if(!req.body.token || !req.body.password){
        return res.json({'error':'some field are missing'});
    }
    else if(req.body.password.length<6){
        return res.json({'error':'password must be greater than 6'})
    }
    else {
        let token = req.body.token;
        try {
            console.log(process.env.JWT_SECRET)
            var decoded = jwt.verify(token, process.env.JWT_SECRET);
            if(decoded){
                res.locals.email = decoded.email;
                res.locals.password = req.body.password;
                return next();
            }
            else{
                res
                return res.json({'error':'token invalid'});
            }
            }
        catch(err) {
            
            res.json({'error':'token invalid'});
          }
    }
}
redirectToError= (req,res,next)=>{
    if(!req.query.token){
        return res.json({
            'error':'token required'
        });
    }
    else {
        let token = req.query.token;
        try {
            var decoded = jwt.verify(token, process.env.JWT_SECRET);
            if(decoded){
                res.locals.token =token;
              
                return next();
            }
            else{
                res
                return res.json({'error':'token invalid'});
            }
            }
        catch(err){
            res.clearCookie('resettoken').json({'error':'some error ocuured'})
          }
    }
}
router.get('/verifyToken',(req,res)=>{
    if(!req.query.token){
        res.json({'error':'token invalid'})
    }
    try{
    jwt.verify(req.query.token,process.env.JWT_SECRET)
    res.json({'msg':'token valid'})
    }
    catch(err){
        res.json({'error':'invalid token'})
    }
})
router.get('/resetPassword',redirectToError,(req,res)=>{
    res.send(`
    <form action="/auth/resetPassword" method="POST">
    <input name="token" type="hidden" value="${res.locals.token}">
    <input name="password" type="password">
    <button type="submit">submit</button>
    </form>
    `)
})
router.post("/resetPassword",redirectToError2,async(req,res)=>{
    const email =  res.locals.email;
    const password = res.locals.password;
    try{
        let User = await UserModel.findOne({email});
        if(User){
            bcrypt.genSalt(10,async(err,salt)=>{
                if(err){
                    return res.json({"error":"Something went Wrong.."})
                }
                bcrypt.hash(password,salt,async(err,hash)=>{
                    if(err){
                        return res.json({"error":"something went wrong.."});
                    }
                    try{
                    User = await UserModel.findOneAndUpdate({email},{$set:{password:hash}});
                    if(User){
                        res.json({'msg':'success'})
                    }
                    else{
                        res.json({'error':'something went wrong'})
                    }
                }
                catch(err){
                    res.json({'error':'error'})
                }
                

                })
            })
        }
        else{
            return res.json({'error':'failed'})
        }
        
    }
    catch(err){
        return res.json({'error':'something went wrong..'})
    }
    
})
router.get("/verify",async(req,res)=>{
    const token = req.query.token;
    try {
        var decoded = jwt.verify(token, process.env.JWT_SECRET);
        let email = decoded.email
        try{
        let User = await UserModel.findOneAndUpdate({email},{$set:{verified:'true'}});
        if(User){
            return res.json({'verification':'success'})
        }
        else{
            return res.json({'error':'verification failed'})
        }
        }
        catch(err){
            return res.json({'error':'something went wrong..'})
        }
        
      } catch(err) {
        res.json({'error':'token expired or invalid...'})
      }

})
router.get("/",redirectToLogin,(req,res)=>{
    res.send(`your email ${req.session.email}`);
});
router.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    try{
        let user = await UserModel.findOne({email});
        if(user){
            bcrypt.compare(password,user.password,(err,success)=>{
                if(success){
                    if(user.verified=='true'){
                        req.session.email = user.email;
                    req.session.name = user.publicKey;
                    res.json({
                        "login":"success",
                        "publicKey":user.publicKey
                    })
                    }
                    else{
                        return res.json({'verified':'Email is not Verified..Please Verify it by clicking the link sent via email'})
                    }
                }
                else{
                    res.json({
                        "error":"Username or Password is Incorrect"
                    })
                }
            })   
        }
        else{
            res.json({
                "error":"Username or Password is Incorrect"
            })
        }
    }
    catch(err){
        return res.redirect("auth/login")
    }

})

router.get("/login",redirectToDashboard,(req,res)=>{
    res.send(`
        <form method="post" action="/login">
        Email :<input type="text" name="email">
        Password :<input type="password" name = "password" >
        <input type="submit">
        </form>
    `);
})
router.get("/logout",(req,res)=>{
    req.session.destroy((err)=>console.log(err))
    res.clearCookie('exp_session')
    res.clearCookie('publicKey');
    res.json({"logout":"success"})
})
router.post("/registerUser",async(req,res)=>{
    const {email,password,name} = req.body;
    if(String(email).length<5){
        return res.json({'error':'provide a valid email.'})
    }
    if(String(password).length<6){
        return res.json({'error':'passwords length must be greater than 6'})
    }
    if(String(name).length<1){
        return res.json({'error':'Name must be provided...'})
    }
    try{
        let User = await UserModel.findOne({email});
        if(User){
            return res.json({"error":"Email is aleready registered.."})
        }
        sendVerification(email,()=>{
            bcrypt.genSalt(10,(err,salt)=>{
                if(err){
                    return res.json({"error":"Something went Wrong.."})
                }
                bcrypt.hash(password,salt,(err,hash)=>{
                    if(err){
                        return res.json({"error":"something went wrong.."});
                    }
                    let wallet = new Wallet();
                    let User = new  UserModel({verified:'false',name,email,password:hash,publicKey:wallet.publicKey,privateKey:wallet.privateKey});
                    User.save().then(r=>{
                        
                        res.json({"registration":"We have registered you Successfully..Please Verify your email address by clicking on link sent you via email"})
                    }).catch(err=>res.redirect("/register"));
                })
            })
        },(err)=>res.json({"error":err}))
        
    }
    catch(err){
        res.json({"error":"something went wrong.."})
    }
    
    
    
})
router.get("/register",redirectToDashboard,(req,res)=>{
    res.send(`
        <form method="post" action="/registerUser">
        Name :<input type="text" name="name">
        Email :<input type="text" name="email">
        Password :<input type="password" name = "password" >
        <input type="submit">
        </form>
    `);
})
module.exports = router;