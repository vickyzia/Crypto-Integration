import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { logoutUser } from "../../../actions/authActions";
import "./changepassword.css";
import "../../../bit_common.css";

class ChangePassword extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      currentPassword: "",
      newPassword: "",
      newPassword2: "",
      errors: {},
      success: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      email: this.props.auth.user.email,
      currentPassword: this.state.currentPassword,
      newPassword: this.state.newPassword,
      newPassword2: this.state.newPassword2
    };

    axios
      .post("http://localhost:5000/api/users/change-password", userData)
      .then(res => {
        console.log(res);
        this.setState({
            email: "",
            currentPassword: "",
            newPassword: "",
            newPassword2: "",
            errors: {},
            success: res.data.success
          });
      })
      .catch(err => {
        console.log(err);
        this.setState({ errors: err.response.data });
      });

    //this.props.loginUser(userData);
  }

  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
  }

  render() {
    const { errors } = this.state;
    const { success } = this.state;
    return (
      <form onSubmit={this.onSubmit} className="cpform_container">
        <input
          type="password"
          placeholder="Current Password"
          name="currentPassword"
          onChange={this.onChange}
          value={this.state.currentPassword}
          className="form-control cpinput"
        />
        {errors.changepwpassword && (
          <div className="help-block" style={{ color: "red" }}>
            {errors.changepwpassword}
          </div>
        )}
        <input
          type="password"
          placeholder="New Password"
          name="newPassword"
          onChange={this.onChange}
          value={this.state.newPassword}
          className="form-control cpinput"
        />
        {errors.newPassword && (
          <div className="help-block" style={{ color: "red" }}>
            {errors.newPassword}
          </div>
        )}
        <input
          type="password"
          placeholder="Confirm New Password"
          name="newPassword2"
          onChange={this.onChange}
          value={this.state.newPassword2}
          className="form-control cpinput"
        />
        {errors.newPassword2 && (
          <div className="help-block" style={{ color: "red" }}>
            {errors.newPassword2}
          </div>
        )}
        <input
          type="submit"
          value="Change Password"
          className="btn btn-primary bit_mt_10 bit_mb_20"
        />
        {success ? <div>Your password has been changed</div> : ""}
      </form>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(ChangePassword);
