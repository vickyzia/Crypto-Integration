import React, { Component } from "react";
import "./css/reg_form.css";
import "../css/modalstyle.css";
import Modal from "react-awesome-modal";
import modal_close_icon from "../../assets/close.png";
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
      sponsor: "",
      errors: {},
      visible: false
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  openModal() {
    this.setState({
      visible: true
    });
  }

  closeModal() {
    this.setState({
      visible: false
    });
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
      password2: this.state.password2,
      sponsor: this.state.sponsor
    };
    console.log(newUser);

    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="reg_form">
        <div className="reg_form_title">Register</div>

        <form
          className="reg_form_container"
          noValidate
          onSubmit={this.onSubmit}
        >
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
            <div className="help-block reg_err_msg">{errors.regemail}</div>
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
            <div className="help-block reg_err_msg">{errors.regemail2}</div>
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
            <div className="help-block reg_err_msg">{errors.regpassword}</div>
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
            <div className="help-block reg_err_msg">{errors.regpassword2}</div>
          )}
          <input
            placeholder="Sponsor (Optional)"
            type="text"
            name="sponsor"
            value={this.state.sponsor}
            onChange={this.onChange}
            className={classnames("form-control reg_input", {
              "has-error": errors.referror
            })}
          />
          {errors.referror && (
            <div className="help-block reg_err_msg">{errors.referror}</div>
          )}
          <div className="reg_checkbox">
            <span className="reg_disclaimer">
              <span className="reg_checkbox_iphone">By registering, </span>I
              agree to the{" "}
              <a href="javascript:void(0);" onClick={() => this.openModal()}>
                Terms
              </a>
            </span>
            <div className="modal_link">
              <Modal
                visible={this.state.visible}
                // width="800"
                effect="fadeInDown"
                onClickAway={() => this.closeModal()}
              >
                <div className="modal_container">
                  <div className="modal_title">Terms of Service</div>
                  <div className="modal_content">
                    Terms of Service Content
                  </div>
                  <a
                    href="javascript:void(0);"
                    onClick={() => this.closeModal()}
                  >
                    <div className="modal_close">
                      <img src={modal_close_icon} />
                    </div>
                  </a>
                </div>
              </Modal>
            </div>
          </div>
          <input type="submit" value="Register" className="regBtn" />
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors.error
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(RegForm));
