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
export default class ForgotPassword extends React.Component {
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
     handleForgot= async(e)=>{
        e.preventDefault();
        this.setState({clicked:true})
        const url = "/auth/forgetPassword";
         const {email} = this.state;
        try {
            var res = await fetch(url,{
                method:'POST',
                headers:{
                   "Content-Type":"application/json" 
                },
              
                body:JSON.stringify({
                    email:email
                })
            })
            res = await res.json();
            console.log(res)
            this.setState({clicked:false,alert:true})
          }
        catch(err){
          this.setState({clicked:false})
            console.log(err)
        }
    }
    
    // if(login){
    //     return <Dashboard logout={()=>{fetch("/auth/logout")}} publicKey={publicKey} username={username}/>
    // }
    render(){
    return (
        <center >
        <div style={{display:'flex',justifyContent:'center',marginTop:10}}>
          <AlertDialog title={'Email sent!'} handleClose = {()=>this.setState({alert:false})} history={this.props.history} discription={'If this email is in our records then you will recieve a link to reset your password via email'} open={this.state.alert}/>
          <Card >
          <CardActionArea>
              <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                  Forgot Password
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                  Enter the Email associated with your account to get password reset link
              </Typography>
              </CardContent>
          </CardActionArea>
          <CardActions >
          <Typography style={{justifyContent:'center',display:'flex',flexDirection:'column',width:'100%'}} >
            <form onSubmit={this.handleForgot} style={{display:'flex',flexDirection:'column',marginLeft:20,marginRight:20,justifyContent:'center'}} required autoComplete="off" >
              <TextField required onChange = {(e)=>this.setState({email:e.target.value})} type="email" id="standard-basic" label="Email" />
              <Typography style={{color:'red',marginTop:10}}>
              
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
