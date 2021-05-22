import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import LoopIcon from '@material-ui/icons/Loop';
var arr = [1,2]
let date = new Date();
export default class  Transactions extends React.Component {
    state = {data:null,refresh:false};
   
    componentDidMount =()=>{
        console.log(this.state.data);
        this.fetchTransactions()

    }
    fetchTransactions = async()=>{
        try{
             let res =await  fetch("/getTransactions");
             res = await res.json();
             res = JSON.parse(res)
             
             this.setState({data:res})
            
        }
        catch(err){
            console.log(err)
        }
    }
    decide =(type)=>{
      if(type=='received'){
          return <ArrowDownwardIcon style={{color:'green'}}/>
      }
      else if(type=='sent'){
      return <ArrowUpwardIcon style={{color:'red'}}/>
      }
      return <LoopIcon />
  }
     RenderList =()=>{
         let data = this.state.data;
         if(!data){
             return <div>Loading...</div>
         }
       if(data.length==0){
           return <center><h4>No Transactions yet..</h4></center>
       }
        
        return data.map(res=>{
            
            return (
                <div className="list">
        <List style={{width:'100%'}}>
                
                    <ListItem >
                        <ListItemAvatar>
                            {this.decide(res.type)}
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <div style={{display:'flex',justifyContent:"space-between"}}>
                            <h4>{res.data.name}</h4>
                            <h4>${res.data.amount}</h4>

                            </div>
                        }
                        secondary={
                            <React.Fragment>
                            <Typography
                                component="span"
                                variant="body2"
                                style={{display:'inline'}}
                                color="textPrimary"
                            >
                                {res.data.timestamp}
                            </Typography>
                            </React.Fragment>
                        }
                        />
                    </ListItem>
                    <Divider variant="inset" component="li" />
               </List>
               </div>
            )
        })
    }
    render()
  {
      return (
    <div style={{display:'flex',flexDirection:'column',justifyContent:"center"}}>
    <center>
    <h5 style={{marginTop:10,borderRadius:20,backgroundColor:'lightgreen',width:150}}>Transactions:</h5>
    </center>
    
    
        <this.RenderList />
    
    </div>
  );
}
}