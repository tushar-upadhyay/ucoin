import React, { useEffect, useState } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { withRouter } from 'react-router';
import Cookie from "universal-cookie";
let cookie = new Cookie();
function Header(props){
    let [signedIn,setSignedIn] = useState(false);
    useEffect(()=>{
        if(cookie.get('exp_session')){
           setSignedIn(true);
        }
    },[])
    return(
            <AppBar style={{position:'sticky',top:0}} fixed position="static">
                <Toolbar className="header" style={{display:'flex',marginRight:20,flex:1,justifyContent:'space-between'}}>
                    <Typography className="head1" variant="h5">
                        U Coin
                    </Typography>
                    
                    <Typography className="head2" variant="h8" >
                        {signedIn?<Button onClick={()=>fetch('/auth/logout').then(res=>props.history.replace("/login"))} variant="contained">Logout</Button>:<div>Login</div>}
                      
                    </Typography>
                </Toolbar>
             </AppBar>
    )
}
export default withRouter(Header);