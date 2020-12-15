import React, { Component } from "react";
import "./css/reg_form.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";

class RegForm extends Component {
  componentDidMount() {}

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      email2: "",
      password: "",
      password2: "",
      errors: {}
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      email: this.state.email,
      email2: this.state.email2,
      password: this.state.password,
      password2: this.state.password2
    };
    console.log(newUser);

    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="reg_form">
        <div className="reg_form_title">Register</div>

        <form className="reg_form_container" noValidate onSubmit={this.onSubmit}>
          <input
            placeholder="Email"
            onChange={this.onChange}
            type="text"
            name="email"
            value={this.state.email}
            className={classnames("form-control reg_input", {
              "has-error": errors.regemail
            })}
          />
          {errors.regemail && (
            <div className="help-block reg_err_msg">
              {errors.regemail}
            </div>
          )}
          <input
            placeholder="Confirm Email"
            type="text"
            name="email2"
            value={this.state.email2}
            onChange={this.onChange}
            className={classnames("form-control reg_input", {
              "has-error": errors.regemail2
            })}
          />
          {errors.regemail2 && (
            <div className="help-block reg_err_msg">
              {errors.regemail2}
            </div>
          )}
          <input
            placeholder="Password"
            type="password"
            name="password"
            onChange={this.onChange}
            value={this.state.password}
            className={classnames("form-control reg_input", {
              "has-error": errors.regpassword
            })}
          />
          {errors.regpassword && (
            <div className="help-block reg_err_msg">
              {errors.regpassword}
            </div>
          )}
          <input
            placeholder="Confirm Password"
            type="password"
            name="password2"
            value={this.state.password2}
            onChange={this.onChange}
            className={classnames("form-control reg_input", {
              "has-error": errors.regpassword2
            })}
          />
          {errors.regpassword2 && (
            <div className="help-block reg_err_msg">
              {errors.regpassword2}
            </div>
          )}
          <input placeholder="Sponsor (Optional)" type="text" className="form-control reg_input" />
          <div className="reg_checkbox">
          <input type="checkbox" />
          <span className="reg_disclaimer">
            <span className="reg_checkbox_iphone">By checking, </span>I agree to
            the{" "}
            <a href="javascript:void(0);">
              Terms
            </a>
          </span>
        </div>
          <input type="submit" value="Register" className="regBtn" />
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
  { registerUser }
)(withRouter(RegForm));
