import React, { Component } from "react";
import BeforeLogin from "../Layouts/BeforeLogin";
import "../css/reg_messages.css";
import transparent_bg from "../../assets/wallpaper/transparent.png";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import {BASE_URL} from '../../utils/constants'

class AfterRegister extends Component {
  constructor(){
    super();
    this.state = {
      msg: "Verification email has been sent",
      isSending: false
    };
    this.resendConfirmationEmail = this.resendConfirmationEmail.bind(this);
  }
  render() {
    return (
      <div>
        <BeforeLogin />
        <div className="full_screen_message_container">
          <div className="full_screen_message">
            {this.state.msg}
          </div>
        </div>

        <div>
          <img id="home_transparent_bg" src={transparent_bg} />
        </div>
        <div>
          <button onClick={this.resendConfirmationEmail} disabled={this.state.isSending} >Resend Email</button>
        </div>
      </div>
    );
  }
  resendConfirmationEmail(){
    this.setState({isSending:true});
    axios
    .post(BASE_URL+'/api/users/resendConfirmationEmail', {email:this.props.regEmail})
    .then(res => {
      this.setState({msg: "Email has been resent successfully"});
      this.setState({isSending:false});
    })
    .catch(err =>
      {
        console.log(err.response.data.msg);
        this.setState({msg:err.response.data.msg});
        this.setState({isSending:false});
      }
    );
  }
}

AfterRegister.propTypes = {
  regEmail: PropTypes.string
};

const mapStateToProps = state => ({
  regEmail: state.auth.regEmail
});

export default connect(
  mapStateToProps,
  { }
)(AfterRegister);
