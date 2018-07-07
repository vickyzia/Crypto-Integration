import React, { Component } from "react";
import "./purchaseform.css";
import "../../utils/metaMask";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {loadComplete, updatePayment} from "../../actions/paymentActions"
import MetaMaskPaymentOption from "../Payments/metamask-payment-option"


class DashboardICO extends Component {
  constructor(props){
    super(props);
    this.onAmountChange = this.onAmountChange.bind(this);
  }
  onAmountChange(event){
    this.props.updatePayment(event.target.value);
  }
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
                onChange={this.onAmountChange}
              />
            </div>
            <div>ETH</div>
          </div>
          <div className="flex_row">
            <div className="contribute_left">Tokens Purchased:</div>
            <div className="contribute_right"> {this.props.paymentData!=null?
              this.props.paymentData.EtherTokenValue*this.props.paymentAmount:0} tokens</div>
          </div>
          <MetaMaskPaymentOption />
        </div>
      </div>
    );
  }
}


DashboardICO.propTypes = {
  loadComplete: PropTypes.func.isRequired,
  updatePayment: PropTypes.func.isRequired,
  paymentData: PropTypes.object,
  paymentAmount: PropTypes.number
};


const mapStateToProps = state => ({
  paymentData: state.payment.paymentData,
  paymentAmount: state.payment.paymentAmount
});

export default connect(mapStateToProps, {loadComplete, updatePayment}) (DashboardICO);
