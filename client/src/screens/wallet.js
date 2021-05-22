import React from "react";
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import CallReceivedRoundedIcon from '@material-ui/icons/CallReceivedRounded';
import { Button, Grid } from "@material-ui/core";
import Transactions from "../components/transactions";
import FileCopyIcon from '@material-ui/icons/FileCopy';
export default class Wallet extends React.Component{
    constructor(props){
        super(props);
        this.state = {balance:'',showKey:'Show Address',renderQR:false,receive:'Receive',color:null,refresh:false};
        this.child = React.createRef()
    }
     renderQR = ()=>{
        
            return(
                <center>
                <h6 style={{backgroundColor:'lightgreen',borderRadius:10,maxWidth:'50%'}}>Ask sender to scan this code </h6>
                <img src={localStorage.getItem('qrcode')} style={{width:150,height:150}} /><br/>
                <Button style={{marginTop:12}} onClick = {()=>this.setState({showKey:this.state.showKey=='Show Address'?'Hide':'Show Address'})} variant="contained" color="primary">{this.state.showKey}</Button>
                {this.renderPublicKey()}
                </center>
            )
        
    }
    componentDidMount = ()=>{
        this.showBalance();
    }
    renderPublicKey = ()=>{
        if(this.state.showKey=='Hide'){
            return (
                <div>
                <div style={{flexDirection:'column',wordBreak:'break-all',display:'flex',marginLeft:10,marginRight:10}}>
                     <h6>{localStorage.getItem('publicKey')}</h6>

                     <FileCopyIcon onClick={()=>{
                         window.navigator.clipboard.writeText(localStorage.getItem('publicKey'))
                         .then(res=>{
                            this.setState({color:'green',isCopied:'Copied To ClipBoard'})
                         })
                         
                    }} style={{color:this.state.color}} fontSize={"18"}/>
                    {this.state.isCopied}
                </div>
                
                </div>
            )
        }
    }
    refresh = ()=>{
        this.showBalance();
        this.child.current.fetchTransactions()
    }
    showBalance = async()=>{
        this.setState({balance:'Loading..'})
        let publicKey = localStorage.getItem('publicKey');
        let balance = await fetch('/getBalance',{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            credentials:'include',
            body:JSON.stringify({
                address:publicKey
            })
        })
        balance = await balance.json();
        console.log(balance)
        if(balance['auth']=='failed'){
             console.log('failed')
           let res =  await fetch('/auth/logout');

           this.props.history.replace("/login")
        }
        this.setState({balance:balance['Balance']})
    }
    render(){
        return (
            <Grid container >
        <Grid item sm={6} xs={12}>
                <div style={{width:'100%'}}>
                    
                <div style={{display:'flex',marginTop:20,justifyContent:'space-around',alignItems:'center'}}>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                        <div onClick={()=>this.props.history.push("/send")} style={{display:'flex',borderRadius:70,backgroundColor:'#007bff',width:70,height:70,alignItems:'center',justifyContent:'center'}} >
                        <SendRoundedIcon style={{fontSize:50,color:'white'}}/>
                        </div>
                        <h4 style={{marginTop:5}}>Send</h4>
                    </div>
                    <div>
                        <h4>
                            Balance<br/>
                            <center >${this.state.balance}</center>
                        
                        </h4>
                    </div>
                   
                </div>
                <div>
                        <center >
                        <Button onClick={this.refresh}  variant="contained" color="primary">Refresh</Button>
                        </center>
                    </div>
                <div style={{marginTop:10}}>
                   
                    {this.renderQR()}
                 
                </div>
                    </div>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                   <div style={{width:'100%'}}>
                      
                       <Transactions ref={this.child}/>
                       
                   </div>
                   </Grid>
            </Grid>
        )
    }
}