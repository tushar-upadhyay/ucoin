import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import Button from "@material-ui/core/Button"
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
export default class Test extends Component {
  state = {
    result: 'No result'
  }
 
  handleScan = data => {
    if (data) {
      this.setState({data:data})
      this.setState({clicked:false})
  }
}
handleGenerateTxn = async(e)=>{
        if(!this.state.tclicked){
        e.preventDefault();
        this.setState({finalTxn:null,tclicked:true,error:null});
        var res = await fetch('/generateTxn',{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password:this.state.password,
                amount:this.state.amount,
                recipient:this.state.data,
                receiver:this.state.receiver,
                sendername:this.state.sendername
            })
        })
        res = await res.json();
        console.log(res)
        if(res.auth=='failed'){
            fetch('/auth/logout').then(res=>this.props.history.replace("/login")).catch(err=>null)
        }
        if(!res.error) {
            this.setState({txn:res,verified:true,error:'Transaction Generated!',tclicked:false})
        }
        else this.setState({error:res.error,tclicked:false})
    }
}
Send = async()=>{
    this.setState({error:null,sclicked:true})
    var res = await fetch('/register-broadcast-transactions',{
        method:'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(this.state.txn)
    })
        res = await res.json();
        if(!res.error) this.setState({finalTxn:res.sent,txn:null,sclicked:false})
        else this.setState({finalTxn:res.error,txn:null,sclicked:false}) 
}
renderSendButton = ()=>{
    if(this.state.finalTxn){
        return <center><h4>{this.state.finalTxn}</h4></center>
    }
    if(this.state.verified){
        if(this.state.sclicked){
            return <center><CircularProgress /></center>
        }
        return (
            <center>
                <Button onClick={this.Send} variant="contained" color="secondary" >Send!</Button>
            </center>
        )
    }
}
renderButton = ()=>{
    
    if(this.state.tclicked){
        return <center><CircularProgress /></center>
    }
    return (
        <Button type="submit" onSubmit = {this.handleGenerateTxn}>Generate Txn</Button>
    )
}

renderForm = ()=>{
    if(!this.state.data && !this.state.clicked){
        return (
            
            <center>
                <div style={{mrginTop:20}}>
                <h4 style={{marginTop:40}}>Paste the receiver's address below or Scan the QR Code</h4>
                <div style={{marginTop:30,display:'flex',flexDirection:'column',width:'50%',height:150}}>
                <form onSubmit={(e)=>{
                    e.preventDefault();
                    this.setState({data:this.state.recipient})
            }}>
                <TextField onChange={e=>this.setState({recipient:e.target.value})} type='text' placeholder="Receiver's address"/>
                <br/>
                <Button type="submit" onSubmit={(e)=>{
                    e.preventDefault()
                    this.setState({data:this.state.recipient})
            }} style={{marginTop:20,width:100}} variant="contained" color="primary">Submit</Button>
                </form>
                </div>
                </div>
            </center>
        )
    }
}
renderError =()=>{
    return <center><h4 style={{marginTop:10}}>{this.state.error}</h4></center>
}
renderReader = ()=>{
    if(this.state.clicked){
        return (
            <div style={{display:'flex',height:200,justifyContent:'center',marginTop:30}}>
                <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: 300}}
        />
            </div>
         
        )
    }
}
renderSubmit = ()=>{
    if(this.state.data){
        return (
            <div style={{marginTop:20,display:'flex',justifyContent:"center",marginRight:20,marginLeft:20}}>
                <center>
                <Card >
          <CardActionArea>
              <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                  Generate Transaction
              </Typography>
              <Typography style={{wordBreak:"break-word"}} variant="body2" color="textSecondary" component="p">
                  
                 <h5>Reciever</h5>: {this.state.data}
              </Typography>
              </CardContent>
          </CardActionArea>
          <CardActions >
          <Typography style={{justifyContent:'center',display:'flex',flexDirection:'column',width:'100%'}} >
            <form onSubmit={this.handleGenerateTxn} style={{display:'flex',flexDirection:'column',marginLeft:20,marginRight:20,justifyContent:'center'}} required autoComplete="off" >
            <TextField required onChange = {(e)=>this.setState({sendername:e.target.value})} type="text" id="standard-basic" label="Your name" />
              <TextField required onChange = {(e)=>this.setState({amount:e.target.value})} type="number" id="standard-basic" label="Amount" />
              <TextField required onChange = {(e)=>this.setState({receiver:e.target.value})} type="text" id="standard-basic" label="Receiver's name" />
              <TextField required onChange = {(e)=>this.setState({password:e.target.value})} type="password" id="standard-basic" label="Password" />
              <Typography style={{color:'red',marginTop:10}}>
              
            </Typography>
              {this.renderButton()}
              </form>
            </Typography>
            </CardActions>
            
          </Card>
          </center>
            </div>

        )
    }
}
renderScan = ()=>{
    if(!this.state.data){
        return(
        <center>
        <div style={{position:'fixed',bottom:0,marginBottom:100,right:0,left:0}}>
        <Button  style={{marginTop:20}} onClick={()=>this.setState({clicked:this.state.clicked?false:true})} variant="contained" color="secondary" >Scan QR</Button>  
        </div>
        
        </center>
        )
    }
}
  handleError = err => {
    console.error(err)
  }
  render() {
    return (
      <div >
        {this.renderForm()}
        {this.renderScan()}
        {this.renderSubmit()}
        {this.renderError()}
        {this.renderSendButton()}
    
        {this.renderReader()}
      </div>
    )
  }
}