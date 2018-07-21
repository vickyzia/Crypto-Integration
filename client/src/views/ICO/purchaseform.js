import React, { Component } from "react";
import "./purchaseform.css";
import "./dashboard_ico.css";
import "../../bit_common.css";
import "../../utils/metaMask";
import { ETH, BTC } from "../../utils/constants";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  loadComplete,
  updatePayment,
  changeCoinType
} from "../../actions/paymentActions";
import MetaMaskPaymentOption from "../Payments/metamask-payment-option";
import CoinPaymentsOption from "../Payments/coinpayments-option";
import Modal from "react-awesome-modal";
import modal_close_icon from "../../assets/close.png";

class DashboardICO extends Component {
  constructor(props) {
    super(props);
    this.onAmountChange = this.onAmountChange.bind(this);
    this.handleCoinChange = this.handleCoinChange.bind(this);
    this.calculateTokenAmount = this.calculateTokenAmount.bind(this);
    this.calculateBonusTokensAmount = this.calculateBonusTokensAmount.bind(this);
    this.state = {
      visible: false,
      tokens: 0,
      bonusTokens: 0
    };
  }
  onAmountChange(event) {
    this.props.updatePayment(event.target.value);
    if(this.props.paymentData!=null){
      this.state.tokens = this.calculateTokenAmount(event.target.value);
      this.state.bonusTokens = this.calculateBonusTokensAmount(event.target.value);
    }
  }
  calculateTokenAmount(paymentAmount){
    if(this.props.coinType == BTC){
      return paymentAmount * this.props.paymentData.BtcTokenValue;
    }
    else{
      return paymentAmount * this.props.paymentData.EtherTokenValue;
    }
  }
  calculateBonusTokensAmount(paymentAmount){
    let ether = paymentAmount;
    if(this.props.coinType == BTC){
      ether = (paymentAmount * this.props.paymentData.BtcTokenValue)/this.props.paymentData.EtherTokenValue;
    }
    let bonus = 0;
    if(ether >= 5){
      bonus= this.state.tokens * 0.50;
    }
    else if(ether >= 3){
      bonus = this.state.tokens * 0.30;
    }
    else if(ether >= 2){
      bonus= this.state.tokens * 0.20;
    }
    else if(ether >= 1){
      bonus= this.state.tokens * 0.10;
    }  
    return bonus;
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

  render() {
    return (
        <div className="bit_card_container bit_full_width bit_mb_20">
          <div className="bit_card_title">Contribute</div>
          <div className="bit_card_content">
            <div className="flex_row flex_justified">
              <div className="bit_radio_container">
                <label className="">
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
              <div className="bit_radio_container">
                <label className="">
                  <input
                    type="radio"
                    name="coinType"
                    value={BTC}
                    onChange={this.handleCoinChange}
                    checked={this.props.coinType === BTC}
                    className="mr-3"
                  />
                  BTC
                </label>
              </div>
            </div>
            <div className="ico_flex_row flex_justified">
              <div>
                <input
                  className="contribute_input"
                  type="text"
                  placeholder={
                    "Amount of " + this.props.coinType + " to contribute"
                  }
                  onChange={this.onAmountChange}
                />
              </div>
            </div>

            <div className="ico_flex_row">
              <div className="ico_contribute_left">Tokens Purchased:</div>
              <div className="ico_contribute_right">
                {this.state.tokens}{" "}
              </div>
            </div>
            <div className="ico_flex_row">
              <div className="ico_contribute_left">Bonus Tokens Received:</div>
              <div className="ico_contribute_right">
                {this.state.bonusTokens}{" "}
              </div>
            </div>
            <div className="ico_flex_row">
              <div className="ico_contribute_left">Total Tokens Received:</div>
              <div className="ico_contribute_right">
                {this.state.tokens + this.state.bonusTokens}{" "}
              </div>
            </div>
            <div className="pay_buttons">
              {this.props.coinType === ETH && (
                <div className="flex_row flex_justified">
                  <MetaMaskPaymentOption />
                </div>
              )}
              <CoinPaymentsOption />
            </div>
          </div>
        </div>
    );
  }
  handleCoinChange(event) {
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

export default connect(
  mapStateToProps,
  { loadComplete, updatePayment, changeCoinType }
)(DashboardICO);
