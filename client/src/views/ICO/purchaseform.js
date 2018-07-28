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
      visible: false
    };
  }
  onAmountChange(event) {
    this.props.updatePayment(event.target.value);
  }
  calculateTokenAmount(){
    if(!this.props.paymentData)
      return 0;
    if(this.props.coinType == BTC){
      return this.props.paymentAmount * this.props.paymentData.BtcTokenValue;
    }
    else{
      return this.props.paymentAmount * this.props.paymentData.EtherTokenValue;
    }
  }
  calculateBonusTokensAmount(){
    if(!this.props.paymentData)
      return 0;
    let ether = this.props.paymentAmount;
    if(this.props.coinType == BTC){
      ether = (this.props.paymentAmount * this.props.paymentData.BtcTokenValue)/this.props.paymentData.EtherTokenValue;
    }
    let bonus = 0;
    let tokens = this.calculateTokenAmount();
    if(ether >= 5){
      bonus= tokens* 0.50;
    }
    else if(ether >= 3){
      bonus = tokens * 0.30;
    }
    else if(ether >= 2){
      bonus= tokens * 0.20;
    }
    else if(ether >= 1){
      bonus= tokens* 0.10;
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
  componentDidMount() {
    console.log("mounted");
    this.loadInterval = setInterval(()=>this.props.loadComplete(this.props.paymentData), 10000)
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
                  type="number"
                  placeholder={
                    "Amount of " + this.props.coinType + " to contribute"
                  }
                  onChange={this.onAmountChange}
                  value = {this.props.paymentAmount<=0?"":this.props.paymentAmount}
                />
              </div>
            </div>

            <div className="ico_flex_row">
              <div className="ico_contribute_left">Tokens Purchased:</div>
              <div className="ico_contribute_right">
                {this.calculateTokenAmount()}{" "}
              </div>
            </div>
            <div className="ico_flex_row">
              <div className="ico_contribute_left">Bonus Tokens Received:</div>
              <div className="ico_contribute_right">
                {this.calculateBonusTokensAmount()}{" "}
              </div>
            </div>
            <div className="ico_flex_row">
              <div className="ico_contribute_left">Total Tokens Received:</div>
              <div className="ico_contribute_right">
                {(this.calculateTokenAmount() + this.calculateBonusTokensAmount(this.props.paymentAmount))}{" "}
              </div>
            </div>
            
            <div className="pay_buttons">
              {this.props.coinType === ETH && (
                <div className="flex_row flex_justified">
                {this.props.isLoading == false && <MetaMaskPaymentOption />}
                  
                </div>
              )}
              {this.props.isLoading == false? 
              this.props.coinType == BTC && 
              (this.props.paymentData == null || this.props.paymentData.BtcTokenValue == 0)?
              "Error loading Bitcoin information. Please try again.": <CoinPaymentsOption /> 
              : "Loading..."}
            
            </div>
          </div>
        </div>
    );
  }
  handleCoinChange(event) {
    this.props.changeCoinType(event.target.value);
    this.props.updatePayment(0);//Reset whenever the coin type changes
  }
  componentWillUnmount() {
    this.props.updatePayment(0);
    clearInterval(this.loadInterval);
  }
}

DashboardICO.propTypes = {
  loadComplete: PropTypes.func.isRequired,
  updatePayment: PropTypes.func.isRequired,
  paymentData: PropTypes.object,
  paymentAmount: PropTypes.number,
  coinType: PropTypes.string.isRequired,
  changeCoinType: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  paymentData: state.payment.paymentData,
  paymentAmount: state.payment.paymentAmount,
  coinType: state.payment.coinType,
  isLoading: state.payment.isLoading,
});

export default connect(
  mapStateToProps,
  { loadComplete, updatePayment, changeCoinType }
)(DashboardICO);
