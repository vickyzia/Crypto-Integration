import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { logoutUser } from "../../../actions/authActions";
import {getUserWalletData} from "../../../actions/paymentActions"
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
        console.log("Result Sucess");
        console.log(res);
        this.setState({
            wallet: '',
            errors: {},
            success: res.data.success
          });
        this.props.getUserWalletData();
      })
      .catch(err => {
        console.log("Result Failed");
        console.log(err.response.data);
        this.setState({ errors: err.response.data });
      });
  }

  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
    this.props.getUserWalletData();
  }

  render() {
    const { errors } = this.state;
    const { success } = this.state;
    return (
      <div className="bit_align_center">
        <div className="current_wallet_container">
            <div className="current_wallet_left">Current token wallet address: </div>
            <div className="current_wallet_right"> {this.props.wallet} </div>
        </div>
        <div className="current_wallet_msg">Please enter a valid ERC223 wallet address</div>
        <form onSubmit={this.onSubmit} className="cpform_container">
          <input
            type="text"
            placeholder={this.props.walletLastUpdatedDays < 1?"Already changed in last 24 hours.":"Wallet Address"}
            name="wallet"
            onChange={this.onChange}
            value={this.state.wallet}
            className="form-control cpinput2"
            disabled={this.props.walletLastUpdatedDays < 1}
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
  errors: state.errors,
  wallet: state.payment.userWalletAddress,
  walletLastUpdatedDays : state.payment.walletLastUpdatedDays
});

export default connect(
  mapStateToProps,
  { logoutUser,getUserWalletData }
)(UpdateWallet);
