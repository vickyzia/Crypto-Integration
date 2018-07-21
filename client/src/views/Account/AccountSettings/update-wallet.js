import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { logoutUser } from "../../../actions/authActions";
import "./changepassword.css";
import "../../../bit_common.css";

class UpdateWallet extends Component {
  constructor() {
    super();

    this.state = {
      wallet: "",
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

    const walletData = {
      email: this.props.auth.user.email,
      wallet: this.state.wallet
    };

    axios
      .post("http://localhost:5000/api/users/update-wallet", walletData)
      .then(res => {
        console.log(res);
        this.setState({
            wallet: '',
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
      <div className="bit_align_center">
        <div className="current_wallet_container">
            <div className="current_wallet_left">Current token wallet address: </div>
            <div className="current_wallet_right"> - </div>
        </div>
        <div className="current_wallet_msg">Please enter a valid ERC223 wallet address</div>
        <form onSubmit={this.onSubmit} className="cpform_container">
          <input
            type="text"
            placeholder="Wallet Address"
            name="wallet"
            onChange={this.onChange}
            value={this.state.wallet}
            className="form-control cpinput2"
          />
          {errors.wallet && (
              <div className="help-block" style={{ color: "red" }}>
                {errors.wallet}
              </div>
            )}
          <input
            type="submit"
            value="Update Token Address"
            className="btn btn-primary bit_mt_10 bit_mb_20"
          />
          {success ? <div>Successfully updated</div> : ""}
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
  { logoutUser }
)(UpdateWallet);
