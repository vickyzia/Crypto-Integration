import React, { Component } from "react";
import "./css/login.css";
import LoginForm from "./login_form.js";
import RegForm from "./reg_form.js";

class Home extends Component {
  componentDidMount() {}
  render() {
    return (
      <div className="login_canvas">        
        <div>
          <div className="login_container">
            <div className="login_aboutPart1">
              <LoginForm />
            </div>

            <div className="login_aboutPart1">
              <RegForm />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Home;
