import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import DoneIcon from '@material-ui/icons/Done';
import Button from '@material-ui/core/Button'
import CancelIcon from '@material-ui/icons/Cancel';
export default class Verify extends React.Component{    
    state = {verification:null};
    componentDidMount = async()=>{
        let data = this.props.location;
        try{
        let res = await fetch(`${data.pathname}${data.search}`);
        res = await res.json();
        console.log(res);
        if(res.verification){
            this.setState({verification:true});
        }
        else{
            this.setState({verification:false});
        }
    }
    catch(err){
        this.setState({verification:'failed'})
    }
    }
    render(){
        if(this.state.verification==true){
            return (
                <div style={{display:'flex',marginTop:200,flex:1,flexDirection:'column',height:'100%',justifyContent:'center',alignItems:"center"}}>
                <DoneIcon style={{color:'green',fontSize:40}} />
                <h4 style={{marginBottom:20,marginTop:20}}>
                    Verified Successfully!
                </h4>
                <Button onClick={()=>this.props.history.replace('/login')} variant='contained' color='primary'>Log In!</Button>
            </div>
            )
        }
        if(this.state.verification==false){
            return (
            <div style={{display:'flex',marginTop:200,flex:1,flexDirection:'column',height:'100%',justifyContent:'center',alignItems:"center"}}>
                <CancelIcon style={{color:'red',fontSize:40}} />   
                <h4 style={{marginTop:20}}>verification Failed..</h4>
                <Button style={{marginTop:20}} onClick={()=>this.props.history.replace('/login')} variant='contained' color='primary'>Log In!</Button>
            </div>
            )
        }

        return (
            <div style={{display:'flex',marginTop:200,flex:1,flexDirection:'column',height:'100%',justifyContent:'center',alignItems:"center"}}>
                <CircularProgress />
                <h4 style={{marginTop:20}}>Verifying....</h4>
            </div>
        )
    }
}