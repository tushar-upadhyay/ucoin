import React from "react";
import {Route} from "react-router-dom";
import BottomBar from "./components/bootomBar";
import Dashboard from "./screens/dashboard";
import Wallet from "./screens/wallet";
import Account from "./screens/account";

import Qr from "./screens/qr"

function App (){
  
    return (
     
        <React.Fragment>
        {/* <Route path="/dashboard"  component = {Dashboard}/>
        <Route path="/account" component={Account} /> */}
        <Route exact path="/send" component={Qr} />
        <Route exact path="/" component={Wallet}/>
       
        {/* <div className ="bottomBar">
          <BottomBar/>
          
         
        </div>
         */}
     </React.Fragment>
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