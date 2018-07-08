import React, { Component } from "react";
import "./purchaseform.css";
import "../../utils/metaMask";
import {ETH, BTC} from "../../utils/constants";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {loadComplete, updatePayment, changeCoinType} from "../../actions/paymentActions"
import MetaMaskPaymentOption from "../Payments/metamask-payment-option"
import CoinPaymentsOption from "../Payments/coinpayments-option"


class DashboardICO extends Component {
  constructor(props){
    super(props);
    this.onAmountChange = this.onAmountChange.bind(this);
    this.handleCoinChange = this.handleCoinChange.bind(this);
  }
  onAmountChange(event){
    this.props.updatePayment(event.target.value);
  }
  render() {
    return (
      <div className="container">
        <div className="bottom">
        <div className="title">Payment Form</div>
        <div className="flex_row">
            <div className="contribute_left">
              <label className="p-3 mr-2">
              
                <input
                  type="radio"
                  name="coinType"
                  value={ETH}
                  checked={this.props.coinType === ETH}
                  className="mr-3"
                  onChange={this.handleCoinChange}
                />
                ETH
              </label>
            </div>
            <div className="contribute_right">
              <label className="p-3">
                <input
                  type="radio"
                  name="coinType"
                  value={BTC}
                  onChange={this.handleCoinChange}
                  checked = {this.props.coinType === BTC}
                  className="mr-3"
                />
                BTC
              </label>
            </div>
        </div>
          <div className="flex_row flex_justified">
            <div>
              <input
                className="contribute_input"
                type="text"
                placeholder={"Amount of "+ this.props.coinType  +" to contribute"}
                onChange={this.onAmountChange}
              />
            </div>
          </div>
          <div className="flex_row">
            <div className="contribute_left">Tokens Purchased:</div>
            <div className="contribute_right"> {this.props.paymentData!=null?
              this.props.paymentData.EtherTokenValue*this.props.paymentAmount:0} tokens</div>
          </div>
          <div className="pay_buttons">
            {this.props.coinType===ETH && <div className="flex_row flex_justified"><MetaMaskPaymentOption /></div>}
            <CoinPaymentsOption />
            </div>
        </div>
      </div>
    );
  }
  handleCoinChange(event){
    this.props.changeCoinType(event.target.value);
  }
}


DashboardICO.propTypes = {
  loadComplete: PropTypes.func.isRequired,
  updatePayment: PropTypes.func.isRequired,
  paymentData: PropTypes.object,
  paymentAmount: PropTypes.number,
  coinType: PropTypes.string.isRequired,
  changeCoinType: PropTypes.func.isRequired
};


const mapStateToProps = state => ({
  paymentData: state.payment.paymentData,
  paymentAmount: state.payment.paymentAmount,
  coinType: state.payment.coinType
});

export default connect(mapStateToProps, {loadComplete, updatePayment, changeCoinType}) (DashboardICO);
