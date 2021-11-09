import './App.css';
// import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { BrowserRouter as  Router, Switch, Route } from 'react-router-dom'

//Routing
import PrivateRoute from './components/routing/PrivateRoute'

//screens
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import PrivateScreen from './screens/PrivateScreen';
import ProfileScreen from './screens/ProfileScreen';
import UpdateEmail from './screens/UpdateEmail';
import UpdateUsername from './screens/UpdateUsername';
import UpdatePassword from './screens/UpdatePassword';
import VerifyScreen from './screens/VerifyScreen';


//components





function App() {

  return (
    <Router>
      <div className="App">
      {/* <UpdateEmail />  */}
        <Switch>   
            <PrivateRoute exact path="/" component={PrivateScreen} />       
            <Route exact path='/login' component={LoginScreen }/>
            <Route exact path='/profile' component={ProfileScreen }/>
            <Route exact path='/register' component={RegisterScreen }/>
            <Route exact path='/forgot-password' component={ForgotPasswordScreen }/>
            <Route exact path='/reset-password' component={ResetPasswordScreen }/>
            <Route exact path='/update-password' component={UpdatePassword }/>
            <Route exact path='/update-email' component={UpdateEmail }/>
            <Route exact path='/update-username' component={UpdateUsername }/>
            <Route exact path='/verify' component={VerifyScreen }/>
        </Switch>
      </div>
    </Router>    
    
   
  );
}

export default App;
