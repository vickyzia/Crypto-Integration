import React, { Component } from "react";
import { loginUser } from "../../actions/authActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";

class ForgotPassword extends Component {
  constructor() {
    super();
    console.log("Forgot Password");
    this.state = {
      email: "",
      msg : ""
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
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      email: this.state.email
    };
    
    axios
    .post("http://localhost:5000/api/users/forgotPassword", userData)
    .then(res => {
      this.setState({
          msg: res.data.msg
        });
    })
    .catch(err => {
      this.setState({msg: err.response.data.msg});
    });
  }
  render() {
    const { msg } = this.state;
    return (
      <div className="login_form">
        <div className="login_form_title">Forgot Password</div>
          <form className="login_form_container" onSubmit={this.onSubmit}>
            <input
              placeholder="Email"
              onChange={this.onChange}
              type="text"
              name="email"
              value={this.state.email}
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
)(withRouter(ForgotPassword));
