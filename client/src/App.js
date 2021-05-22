import React from "react";
import {Route} from "react-router-dom";
import BottomBar from "./components/bootomBar";
import Dashboard from "./screens/dashboard";
import Wallet from "./screens/wallet";
import Account from "./screens/account";

import Qr from "./screens/qr"
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme, CssBaseline, } from "@material-ui/core";
import { deepOrange, orange } from "@material-ui/core/colors";
function App (){
  const theme = createMuiTheme({
    palette: {
   
      type: 'dark',
      
    },
  });
    return (
     <ThemeProvider theme={theme}>
        
        {/* <Route path="/dashboard"  component = {Dashboard}/>
        <Route path="/account" component={Account} /> */}
        <Route exact path="/send" component={Qr} />
        <Route exact path="/" component={Wallet}/>
       <CssBaseline />
        {/* <div className ="bottomBar">
          <BottomBar/>
          
         
        </div>
         */}
      </ThemeProvider>
    )
}
function Test(){
  return (
    <div>
      <h1>
        This is test
      </h1>
    </div>
  )
}
export default App;