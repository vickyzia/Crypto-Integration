import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";

class ResetPassword extends Component {
  constructor() {
    super();
    console.log("Reset Password");
    this.state = {
      password:"",
      confirmPassword: "",
      msg : ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
    if(!this.props.match.params.tokenData){
        this.props.history.push("/login");
    }
    if(!this.props.match.params.token){
        this.props.history.push("/login");
    }

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      newPassword: this.state.password,
      confirmPassword : this.state.confirmPassword,
      tokenData : this.props.match.params.tokenData,
      token : this.props.match.params.token
    };
    if(userData.newPassword != userData.confirmPassword){
        this.setState({msg:"Password and confirm password must be same."});
    }
    if(userData.newPassword && userData.newPassword.length<6 ){
        this.setState({msg:"Password must be atleast 6 characters."});
    }
    axios
    .post("http://localhost:5000/api/users/resetPassword", userData)
    .then(res => {
      this.setState({
          msg: res.data.msg
        });
        this.props.history.push('/login');
    })
    .catch(err => {
      this.setState({msg: err.response.data.msg});
    });
  }
  render() {
    const { msg } = this.state;
    return (
      <div className="login_form">
        <div className="login_form_title">Reset Password</div>
          <form className="login_form_container" onSubmit={this.onSubmit}>
            <input
              placeholder="Password"
              onChange={this.onChange}
              type="password"
              name="password"
              value={this.state.password}
              className="form-control login_input"
            />

            <input
              placeholder="Confirm Password"
              onChange={this.onChange}
              type="password"
              name="confirmPassword"
              value={this.state.confirmPassword}
              className="form-control login_input"
            />
              <div className="help-block login_err_msg">
                {msg}
              </div>
            <input type="submit" value="Submit" />
          </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
)(withRouter(ResetPassword));
