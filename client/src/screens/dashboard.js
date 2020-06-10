import React,{useState} from "react"
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Cookie from "universal-cookie";
let cookie = new Cookie();
  export default class  DashBoard extends React.Component{
    state = {amount:0,password:null,recipient:null,error:null,txn:null,balance:null,verified:false,finalTxn:null}
    componentDidMount = ()=>{
        if(!cookie.get('exp_session')){
            return this.props.history.replace("/login")
        }
        let publicKey  = cookie.get('publicKey');
        this.setState({publicKey,qrcode:localStorage.getItem('qrcode')});
    }
     showBalance = async()=>{
        this.setState({balance:'Loading...'})
        var res = await fetch('/getBalance',{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            credentials:'include',
            body:JSON.stringify({
                address:this.state.publicKey
            })
        })
        res = await res.json();
        this.setState({balance:res['Balance']})
        
    }
    renderBalance =()=>{
        if(this.state.balance!=null){
            return (
                <center>
            <div style={{display:'flex',flexDirection:'column',justifyContent:'center',flex:1}}>
                <h2>
                    Balance 
                </h2>
                <h2>
                    ${this.state.balance}
                </h2>
            </div>
            </center>
            )
            }
            if(this.state.balance=="loading"){
                return (
                    <div>
                        Loading...
                    </div>
                )
            }
        }
    
     sendit = async(e)=>{
        
        this.setState({verified:false,txn:null})
        
        e.preventDefault()
        var res = await fetch('/register-broadcast-transactions',{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(this.state.txn)
        })
        res = await res.json();
        if(!res.error) this.setState({finalTxn:res.sent})
        else this.setState({finalTxn:res.error}) 
    }
    generate = async (e) =>{
        e.preventDefault();
        this.setState({finalTxn:null});
        var res = await fetch('/generateTxn',{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                sender:this.state.publicKey,
                password:this.state.password,
                amount:this.state.amount,
                recipient:this.state.recipient
            })
        })
        res = await res.json();
        console.log(res)
        if(res.auth=='failed'){
            fetch('/auth/logout').then(res=>this.props.history.replace("/login")).catch(err=>null)
        }
        if(!res.error) {
            this.setState({txn:res,verified:true,error:'Your Transaction is Valid'})
        }
        else this.setState({error:res.error})
    }
    renderSendButton =()=>{
        if(this.state.verified){
            return (
                <Button onClick={this.sendit} color='primary'>Send it!</Button>
            )
        }
    }
    render(){
    return(
        <center >
    <div style={{display:'flex',justifyContent:'center',marginTop:20,flexDirection:'column',flex:1,padding:10}}>
        
    <div style={{display:'flex',wordBreak:'break-all',margin:5,flexDirection:'column',justifyContent:'center',flex:1}} >
    <img style={{height:150,width:150}} alt = "tusa" src={this.state.qrcode}/>
                
                <p >Your Wallet Address is</p>
                <p>
                {this.state.publicKey}
                </p>
                </div>      
            <div style={{display:'flex'}}> 
            <Button onClick={this.showBalance}  size="small" color="primary">
            Show Balance
            </Button>
            
            <Button onClick={()=>fetch('/auth/logout').then(res=>this.props.history.replace("/login"))}  size="small" color="primary">
            Logout
            </Button>
            </div>
            {this.renderBalance()}
            <form onSubmit={this.generate} style={{width:200,display:'flex',flexDirection:'column',marginLeft:20,marginRight:20,justifyContent:'center'}} required autoComplete="off" >
            <TextField onChange = {(e)=>this.setState({recipient:e.target.value})} type="text" id="standard-basic" label="Recevier address" />
            <TextField onChange = {(e)=>this.setState({amount:e.target.value})} type="number" id="standard-basic" label="Amount" />
            {/* TODO : implementation of auth system
           
           <TextField onChange = {(e)=>updatePassword(password=e.target.value)} type="password" id="standard-basic" label="Password" /> */}
         <TextField onChange = {(e)=>this.setState({password:e.target.value})} type="password" id="standard-basic" label="Transaction password" />
          <Button type='submit' color='primary'>Generate Txn!</Button>
          </form>
          {this.state.error}
          {this.renderSendButton()}
          {this.state.finalTxn}
    </div>
    
    </center>
    )
        }
  }