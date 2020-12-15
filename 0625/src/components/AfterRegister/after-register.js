import React, { Component } from "react";
import "../css/reg_messages.css";

class AfterRegister extends Component {
  render() {
    return (
      <div>
        <div className="full_screen_message_container">
          <div className="full_screen_message">
            A confirmation link was sent to your email address
          </div>
        </div>
      </div>
    );
  }
}

export default AfterRegister;
