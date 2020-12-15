import React, { Component } from "react";
import "./css/login.css";
import LoginForm from "./login_form.js";
import RegForm from "./reg_form.js";
import transparent_bg from "../../assets/wallpaper/transparent.png";
import BeforeLogin from "../Layouts/BeforeLogin";
import uparrow from "../../assets/up-arrow.png";
import ScrollUpButton from "react-scroll-up-button";

class Home extends Component {
  componentDidMount() {}
  render() {
    return (
      <div className="login_canvas">
        <BeforeLogin />

        <div>
          <div className="login_container">
            <div className="login_aboutPart1">
              <LoginForm />
            </div>
            <div className="login_content_divider">
              <div className="login_content_divider_left" />
              <div className="login_content_divider_title">Not A Member?</div>
              <div className="login_content_divider_right" />
            </div>
            <div className="login_aboutPart1">
              <RegForm />
            </div>
          </div>
        </div>
        <div>
          <img id="login_transparent_bg" src={transparent_bg} />
        </div>
      </div>
    );
  }
}
export default Home;
