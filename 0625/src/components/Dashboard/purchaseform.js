import React, { Component } from "react";
import "./purchaseform.css";
import ReactDOM from "react-dom";


class DashboardICO extends Component {
  componentDidMount() {}
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
          <div className="pay_buttons">
            <button>Pay with Metamask</button>
            <button>Pay with Coinpayments</button>
          </div>
        </div>
      </div>
    );
  }
}
export default DashboardICO;
