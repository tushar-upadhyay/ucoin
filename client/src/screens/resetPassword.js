import React from 'react';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import CircularProgress from '@material-ui/core/CircularProgress';
import AlertDialog from "../components/alerts";
export default class ResetPassword extends React.Component {
    componentDidMount = ()=>{
        let data = this.props.history.location.search;
        let token = String(data.split('?token=')[1]);
        fetch(`/auth/verifyToken?token=${token}`).then(res=>res.json()).then(res=>res.msg?this.setState({token}):this.props.history.replace('/login'))
        
    }
     state = {email:null,clicked:false,alert:false}
     renderButton =()=>{
      if(this.state.clicked){
          return <center><CircularProgress /></center>
      }
      return (
          <Button type="sumbit" onSubmit={this.handleForgot} size="small" color="primary">
              Submit
          </Button>
      )
  }
     handleReset= async(e)=>{
        e.preventDefault();
        if(this.state.password==this.state.password2){
            this.setState({'error':null})
        this.setState({clicked:true})
        const url = "/auth/resetPassword";
         const {password,token} = this.state;
        try {
            var res = await fetch(url,{
                method:'POST',
                headers:{
                   "Content-Type":"application/json" 
                },
                body:JSON.stringify({
                    password,token
                })
            })
            res = await res.json();
            console.log(res);
            if(res.msg){
                this.setState({clicked:false,alert:true});
            }   
            else{
                this.setState({clicked:false,error:res.error})
            }
          }
        catch(err){
          this.setState({clicked:false,error:res.error})
            
        }
    }
    else{
        this.setState({error:'Passwords not match'})
    }
    }
    
    // if(login){
    //     return <Dashboard logout={()=>{fetch("/auth/logout")}} publicKey={publicKey} username={username}/>
    // }
    render(){
        if(!this.state.token){
            return <div>Redirecting...</div>
        }
    return (
        <center >
        <div style={{display:'flex',justifyContent:'center',marginTop:10}}>
          <AlertDialog title={'Password Changed!'} handleClose = {()=>this.setState({alert:false})} history={this.props.history} discription={'You can login Now'} open={this.state.alert}/>
          <Card >
          <CardActionArea>
              <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                  Forgot Password
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                  Type New Password
              </Typography>
              </CardContent>
          </CardActionArea>
          <CardActions >
          <Typography style={{justifyContent:'center',display:'flex',flexDirection:'column',width:'100%'}} >
            <form onSubmit={this.handleReset} style={{display:'flex',flexDirection:'column',marginLeft:20,marginRight:20,justifyContent:'center'}} required autoComplete="off" >
              <TextField required onChange = {(e)=>this.setState({password:e.target.value,error:null})} type="password" id="standard-basic" label="New Password" />
              <TextField required onChange = {(e)=>this.setState({password2:e.target.value,error:null})} type="password" id="standard-basic" label="Confirm Password" />
              <Typography style={{color:'red',marginTop:10}}>
              {this.state.error}
            </Typography>
              {this.renderButton()}
              </form>
            </Typography>
            </CardActions>
            
          </Card>
          
      </div>
       </center>
  )
    }
}
