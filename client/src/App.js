import React, { Component } from "react";
import "./App.css";
import Login from "./components/Login/login.js";
import uparrow from "./assets/up-arrow.png";
import { Link } from "react-router-dom";
import ScrollUpButton from "react-scroll-up-button";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {Redirect} from "react-router-dom";
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import Confirmation from "./components/Confirmation/confirmation";
import AfterRegister from "./components/AfterRegister/after-register";
import { DefaultLayout } from './containers';
// CoreUI Icons Set
import '@coreui/icons/css/coreui-icons.min.css';
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import './scss/style.css'


// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = '/';
  }
}

class App extends Component {
  componentDidMount() {}
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Route exact path="/login" component={Login} />
            <Route exact path="/confirmation/:token" component={Confirmation} />
            <Route exact path="/after-register" component={AfterRegister} />
            <Route path="/dashboard" component={DefaultLayout} />
            <Redirect from="/" to="/login" />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
