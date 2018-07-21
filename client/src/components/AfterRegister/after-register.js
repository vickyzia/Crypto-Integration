import React, { Component } from "react";
import BeforeLogin from "../Layouts/BeforeLogin";
import "../css/reg_messages.css";
import transparent_bg from "../../assets/wallpaper/transparent.png";

class AfterRegister extends Component {
  render() {
    return (
      <div>
        <BeforeLogin />
        <div className="full_screen_message_container">
          <div className="full_screen_message">
            Verification email has been sent
          </div>
        </div>

        <div>
          <img id="home_transparent_bg" src={transparent_bg} />
        </div>
      </div>
    );
  }
}

export default AfterRegister;
