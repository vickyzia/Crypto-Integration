import React, { Component } from "react";
import { getStyle } from "@coreui/coreui/dist/js/coreui-utilities";
import "./dashboard_ico.css";
import ReactDOM from "react-dom";

import "../../bit_common.css";

import TransactionList from "../Payments/TransactionList";
import PurchaseForm from "./purchaseform.js";

class ICO extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected
    });
  }

  render() {
    return (
      <div className="animated fadeIn">
        <div className="dashboard_ico_container">
          <div className="bit_card_container bit_full_width bit_mb_20">
            <div className="bit_card_title_fiverr">Fiverr Requirements</div>
            <div className="bit_card_content">
              <div className="bit_align_left">
              <p>Hello, I have added a few things into the user schema to support what I'm looking for. You can change/delete them if you need to.

                <ul>
                  <li>
                      refcode: unique code for each user to be used later as a referral code
                  </li>
                  <li>
                      sponsor: referral code used during registration (optional)
                  </li>
                  <li>
                      hftBal: token balance on the website
                  </li>
                  <li>
                      hftBlockchainSent: tokens sent to user's token wallet on the blockchain. If this value is less than hftBal, there is an "outstanding balance"
                    </li>
                    <li>
                      ETH:  user's erc20/223 token wallet address
                  </li>
                  </ul>
              </p>
                <p>
                  Task 1 - In Contribute payment form below, we have 3 figures we need
                  to calculate based on user input.
                  <ul>
                    <li className="bit_mt_10">
                      <u>Tokens Purchased</u>. FOR ETH payment: calculate tokens purchased based on pre-set 'ETH
                      to token' conversion rate (this has already been
                      implemented from previous job). FOR BTC: calculate token
                      purchased based on 'BTC to ETH' market conversion rate.
                      This can be done through a scheduler, which reads current
                      market data and stores it for a pre-set duration, then
                      used to calculate the 'BTC to token' conversion rate. Need
                      a failsafe in case market data could not be read, we can
                      store a default value on file as insurance. 
                    </li>
                    <li className="bit_mt_10">
                      <u>Bonus Tokens Received</u>. Calculate Bonus Tokens Received based on user input. BTC payments receive the same bonus after converting to ETH.
                      <ul>
                        <li>If purchase amount >= 1 ETH, bonus = 10%. </li>
                        <li>If purchase amount >= 2 ETH, bonus = 20%. </li>
                        <li>If purchase amount >= 3 ETH, bonus = 30%. </li>
                        <li>If purchase amount >= 5 ETH, bonus = 50%. </li>
                      </ul>
                    </li>
                    <li className="bit_mt_10">
                    <u>Total Tokens Received</u>. Shows Tokens Purchased + Bonus Tokens Received
                    </li>
                  </ul>
                </p>
                <p>
                  Task 2 - Since all submitted transactions start with 'pending'
                  status, we need a scheduler to process newly confirmed transactions
                  every X hours. This means that transactions should have a flag
                  in the database that shows the 'process status'
                  <ul>
                    <li className="bit_mt_10">
                      For all confirmed transactions that have NOT been
                      processed: we need to increase user's current token balance in database by the value of 'Total Tokens Received.' Once this is done, we need to update process
                      status to yes.
                    </li>
                    <li>
                      We need a manual way to perform this as well within the admin page
                      </li>
                  </ul>
                </p>
                <p>
                  Task 3 - For CoinPayment transactions, insert '_blank href link' into the 'transaction created' message (the message right under payment button). The message is currently "A Transaction has been created please complete the transaction on the given address."  Change it to "Transaction created. <a href="javascript:void(0);">Please click here to proceed.</a>" The link will open a new page for user to proceed with payment.
                </p>
              </div>
            </div>
          </div>
          <PurchaseForm />
          <div className="bit_card_container bit_mb_20 bit_full_width">
            <div className="bit_card_title">Contribution History</div>
            <div className="bit_card_content">
              <TransactionList />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ICO;
