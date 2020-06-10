import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
export default function Header(){
    return(
            <AppBar style={{position:'sticky',top:0}} fixed position="static">
                <Toolbar className="header" style={{display:'flex',marginRight:20,flex:1,justifyContent:'space-between'}}>
                    <Typography className="head1" variant="h5">
                        U Coin
                    </Typography>
                    
                    <Typography className="head2" variant="h8" >
                        Simple BlockChain Based Cryptocurrency
                    </Typography>
                </Toolbar>
             </AppBar>
    )
}