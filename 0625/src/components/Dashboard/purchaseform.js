import React, { Component } from "react";
import "./purchaseform.css";
import isEmpty from "lodash/isEmpty"
import ReactDOM from "react-dom";
import { AccountUnavailable } from "../MetaMask/account-unavailable";
import { WrongNetwork } from "../MetaMask/wrong-network";
import { ErrorWeb3 } from "../MetaMask/error-web3";
import "../../utils/metaMask";
import { isWeb3Available, getAccounts, getNetworkId } from "../../utils/metaMask";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {loadComplete} from "../../actions/paymentActions"
import MetaMaskPaymentOption from "../MetaMask/metamask-payment-option"


class DashboardICO extends Component {
  render() {
    return (
      <div className="container">
        <div className="bottom">
        <div className="title">Payment Form</div>
          <div className="flex_row flex_justified">
            <div>
              <input
                className="contribute_input"
                type="text"
                placeholder="Amount of ETH to contribute"
              />
            </div>
            <div>ETH</div>
          </div>
          <div className="flex_row">
            <div className="contribute_left">Tokens Purchased:</div>
            <div className="contribute_right"> X tokens</div>
          </div>
          <MetaMaskPaymentOption />
        </div>
      </div>
    );
  }
}


DashboardICO.propTypes = {
  loadComplete: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {loadComplete}) (DashboardICO);
