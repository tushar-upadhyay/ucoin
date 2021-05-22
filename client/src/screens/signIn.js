import React,{useState} from 'react';
import QRCode from "qrcode";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Cookies from "universal-cookie";
import CircularProgress from '@material-ui/core/CircularProgress';
import AlertDialog from "../components/alerts";
let cookie = new Cookies();
export default class SignIn extends React.Component {
     state = {username:null,password:null,clicked:false,error:null,resendPassword:null}
     renderButton =()=>{
      if(this.state.clicked){
          return <center><CircularProgress /></center>
      }
      return (
          <Button type="submit" onSubmit={this.handleLogin} size="small">
              Login
          </Button>
      )
  }
     handleLogin = async(e)=>{
        e.preventDefault();
        this.setState({clicked:true})
        const url = "/auth/login";
         const {email,password} = this.state;
        try {
            var res = await fetch("/auth/login",{
                method:'POST',
                headers:{
                   "Content-Type":"application/json" 
                },
              
                body:JSON.stringify({
                    email:email,
                    password:password
                })
            })
            res = await res.json();
            cookie.set('publicKey',res.publicKey);
            if(res.login=="success"){ 
              QRCode.toDataURL(res.publicKey, (err, url)=>{
                localStorage.setItem('qrcode',String(url));
                localStorage.setItem('publicKey',res.publicKey);
                this.props.history.replace('/',{
                  state:{publicKey:res.publicKey}
                })
              })
                
            }
            else if(res.verified){

              this.setState({clicked:false,alert:true,discription:res.verified,resendPassword:this.state.password})
            }
            else{
              this.setState({clicked:false,error:res.error})
              console.log(res.error)
            }
          }
        catch(err){
          this.setState({clicked:false,error:'error'})
            console.log(err)
        }
    }
    resend = async()=>{
      let res = await fetch("/auth/resendVerification",{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          email:this.state.email,
          password:this.state.resendPassword
        })
      })
      res  = await res.json();
      if(res.msg){
        return 'sent'
      }
      else{
        return res.error;
      }
    }
    
    // if(login){
    //     return <Dashboard logout={()=>{fetch("/auth/logout")}} publicKey={publicKey} username={username}/>
    // }
    render(){
    return (
        <center >
        <div style={{display:'flex',justifyContent:'center',marginTop:10}}>
          <AlertDialog resendEmail ={this.resend} resend={true} handleClose = {()=>this.setState({alert:false})} history={this.props.history} discription={this.state.discription} open={this.state.alert}/>
          <Card >
          <CardActionArea>
              <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                  U Coin
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                  U Coin is the simplest implementation of blockchain technology
              </Typography>
              </CardContent>
          </CardActionArea>
          <CardActions >
          <Typography style={{justifyContent:'center',display:'flex',flexDirection:'column',width:'100%'}} >
            <form onSubmit={this.handleLogin} style={{display:'flex',flexDirection:'column',marginLeft:20,marginRight:20,justifyContent:'center'}} required autoComplete="off" >
              <TextField required onChange = {(e)=>this.setState({email:e.target.value})} type="email" id="standard-basic" label="Email" />
              <TextField required onChange = {(e)=>this.setState({password:e.target.value})} type="password" id="standard-basic" label="Password" />
              <Typography style={{color:'red',marginTop:10}}>
              {this.state.error}
            </Typography>
              {this.renderButton()}
              </form>
            </Typography>
            </CardActions>
            
          <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',padding:8}}>
            
          <span style={{color:'green',fontWeight:'bold'}}>
            Dont Have an Account?
          </span>
          <Button variant="contained" style={{marginTop:10,width:100}} onClick={()=>this.props.history.push("/register")} size="small">
              Sign Up
              </Button>
              </div>
          </Card>
          
      </div>
      <Button onClick={()=>this.props.history.push("/forgotPassword")} style={{marginTop:20}} color="primary" variant='contained'>Forgot Password?</Button>
      </center>
  )
    }
}
