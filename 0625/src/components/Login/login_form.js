import React, { Component } from "react";
import "./css/login_form.css";
import { loginUser } from "../../actions/authActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class LoginForm extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  }
  render() {
    const { errors } = this.state;
    return (
      <div className="login_form">
        <div className="login_form_title">Log In</div>
          <form className="login_form_container" onSubmit={this.onSubmit}>
            <input
              placeholder="Email"
              onChange={this.onChange}
              type="text"
              name="email"
              value={this.state.email}
              className="form-control login_input"
            />
            {errors.email && (
              <div className="help-block login_err_msg">
                {errors.email}
              </div>
            )}
            {errors.match && (
              <div className="help-block login_err_msg">
                {errors.match}
              </div>
            )}
            {errors.msg && (
              <div className="help-block login_err_msg">
                {errors.msg}
              </div>
            )}
            <input
              placeholder="Password"
              type="password"
              name="password"
              onChange={this.onChange}
              value={this.state.password}
              className="form-control login_input"
            />
            {errors.password && (
              <div className="help-block login_err_msg">
                {errors.password}
              </div>
            )}
            <input type="submit" value="Login" className="loginBtn" />
          </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(withRouter(LoginForm));
