import React from "react";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import AlertDialog from "../components/alerts";
export default class SignUp extends React.Component{
    state = {clicked:false,name:null,password:null,email:null,msg:null,alert:false};
    onRegister=async(e)=>{
        e.preventDefault();
        const url = "/auth/registerUser";
        const {name,email,password} = this.state;
        if(name && email && password){
            this.setState({clicked:true})
        if(password.length<6){
            this.setState({clicked:false})
            return this.setState({msg:'Password length must be greater than 6'})
        }
        try{
            let res = await fetch(url,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({email,password,name})
            })
            console.log(res)
            res = await res.json();
            
            if(res.registration!=null){
                this.setState({clicked:false,alert:true,discription:res.registration})
            }
            else{
                console.log(res.error);
                this.setState({clicked:false,msg:res.error})
            }
            console.log(res)
            }
        catch(err){
            console.log('error')
        }
    }

    }
    
    renderButton =()=>{
        
        if(this.state.clicked){
            return <center><CircularProgress /></center>
        }
        return (
            <Button type="sumbit" onSubmit={this.onRegister} size="small" color="primary">
                Register
            </Button>
        )
    }
    render(){
        return(
            <center >
                <div style={{display:'flex',justifyContent:'center',marginTop:10}}>
                    <Card>
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    U Coin
                                </Typography>
                                <Typography variant="body1" color="textSecondary" component="p">
                                    Registration
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions >
                            <Typography style={{justifyContent:'center',display:'flex',flexDirection:'column',width:'100%'}} >
                                <form onSubmit={this.onRegister} style={{display:'flex',flexDirection:'column',marginLeft:20,marginRight:20,justifyContent:'center'}} required autoComplete="off" >
                                    <TextField onChange={(e)=>this.setState({name:e.target.value})} type="text" id="standard-basic" autoComplete="off" required label="Name" />
                                    <TextField onChange={(e)=>this.setState({email:e.target.value})} required  type="email" id="standard-basic" autoComplete="off" label="Email" />
                                    <TextField onChange={(e)=>this.setState({password:e.target.value})} required type="password" id="standard-basic" autoComplete="off" label="Password" />
                                    <this.renderButton />  
                                    <AlertDialog title={'Registered Successfully'} discription={this.state.discription} open={this.state.alert} history={this.props.history} />
                                </form> 
                                <center >
                                <div style={{width:200,display:'flex',justifyContent:'center'}}>
                                    <span style={{color:'red',marginTop:5}}>
                                        {this.state.msg}
                                    </span>
                                </div>
                                    </center>
                             
                            </Typography>
                        </CardActions>
                        
                        <CardActions style={{display:'flex',justifyContent:'center',flexDirection:'column'}} >
                        
                            <span style={{color:'green',fontWeight:'bold'}}>
                                Already Have an Account?
                            </span>
                          <Button onClick={()=>this.props.history.replace("/login")} style={{marginTop:10}} size='small' color='primary'>Login</Button> 
                        </CardActions>
                    </Card>
        
    </div>
    
    </center>

        )
    }
}