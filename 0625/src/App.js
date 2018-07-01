import React, { Component } from "react";
import "./App.css";
import Login from "./components/Login/login.js";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/dashboard";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import Confirmation from "./components/Confirmation/confirmation";
import AfterRegister from "./components/AfterRegister/after-register";
import store from "./store";


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
    window.location.href = "/login";
  }
}

class App extends Component {
  componentDidMount() {}
  render() {
    return (
        <Router>
          <div>
            <Route exact path="/login" component={Login} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/confirmation/:token" component={Confirmation} />
            <Route exact path="/after-register" component={AfterRegister} />
          </div>
        </Router>
    );
  }
}

export default App;
