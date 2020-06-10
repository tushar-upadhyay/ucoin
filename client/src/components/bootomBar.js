import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DashboardIcon  from "@material-ui/icons/Dashboard"
import Account from "@material-ui/icons/AccountBox"
import {withRouter} from "react-router-dom";
import Wallet from "@material-ui/icons/AccountBalanceWallet"

let variant = 'center'
if(window.outerWidth<500){
    variant='space-between'
}
const useStyles = makeStyles({

  root: {
    flexGrow: 1
  },
});

function BottomBar(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const routes = {
      0:"dashboard",
      2:"account",
      1:"wallet"
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.history.replace(`/${routes[newValue]}`)
  };

  return (
    <Paper   className={classes.root} style={{backgroundColor:'black'}}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="Secondary"
        style={{color:'white'}}
        
      >
        <Tab label="Dashboard" icon={<DashboardIcon />} >
            
        </Tab>
        
        <Tab label="Wallet" icon={<Wallet />}  />
        <Tab label="Account" icon={<Account />}  />
      </Tabs>
    </Paper>
  );
}
export default withRouter(BottomBar)