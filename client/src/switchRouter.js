import React,{Fragment} from "react";
import Cookies from "universal-cookie";
import {Route,withRouter,Switch} from "react-router-dom";
import Header from "./components/header"
import SignInScreen from "./screens/signIn";
import SignUpScreen from "./screens/signUp";
import ForgotPassword from "./screens/forgotPassword";
import ResetPassword from "./screens/resetPassword";
import VerifyEmail  from "./screens/verifyEmail";
import App from "./App"
import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";
let cookie = new Cookies();
// const theme = createMuiTheme({
//     palette: {
   
//       type: 'dark',
      
//     },
//   });
class SwitchRouter extends React.Component{
    state = {verification:false};
    componentDidMount =()=>{
        
        if(!cookie.get('exp_session') && this.props.location.pathname!='/resetPassword' && this.props.location.pathname!='/auth/verify'){
          return  this.props.history.replace("/login")
        }
        
        if(cookie.get('exp_session')){
            fetch('/auth/checkAuth').then(res=>res.json()).then(res=>res['auth']=='failed'?this.props.history.replace("/login"):this.props.history.replace("/")).catch(err=>console.log(err));
           
        }
    }
    render(){
        return(
            <ThemeProvider>
            <Fragment>
                <Header />
                <Switch >
                <Route exact path="/auth/verify" component = {VerifyEmail} />
                <Route exact path="/resetPassword" component={ResetPassword}/>
                <Route exact path="/login" render={(props)=><SignInScreen {...props} handleAuth= {(cookie)=>{}} />} /> 
                <Route exact path="/register" component={SignUpScreen} />
                <Route exact path="/forgotPassword" component={ForgotPassword} />
                <App />
                </Switch>
            </Fragment>
            <CssBaseline />
            </ThemeProvider>
        )
    }
}
export default withRouter(SwitchRouter)