import React, { Component } from "react";
import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";
import { getStyle } from "@coreui/coreui/dist/js/coreui-utilities";
import ReactDOM from "react-dom";

import "../../bit_common.css";

class AdminOnly extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <div className="dashboard_ico_container">
          <div className="bit_card_container bit_full_width bit_mb_20">
            <div className="bit_card_title_fiverr">Fiverr Requirements</div>
            <div className="bit_card_content">
              <div className="bit_align_left">
                <p>
                  I need a page that is admin only, with admin level
                  functionalities. I do not care how the page looks, as long as
                  the functions work.
                </p>
                <p>
                  Task #1: Function to send user tokens manually. We can find
                  users based on their email, and specify an amount of tokens to
                  add onto their balance. Once we send it, we need to log this
                  as a transaction to display on user's 'Payout' section.
                </p>
                <p>Task #2: Function to delete user accounts</p>
                <p>Task #3: Function to manually perform the operations by the scheduler, i.e., send user tokens they purchased and mark transaction as processed.</p>
                <p>
                  Task #3: Since users are purchasing tokens, we need to be able
                  to send them the actual tokens on the blockchain. We need a
                  function to trigger payment (Metamask is fine) using our own
                  token on the Ethereum network. We have asked the users to link
                  their ERC20/223 compatiable wallets in the Settings section,
                  which will be the "pay to address." I will provide the "pay
                  from address." We need to know the "outstanding balance" for
                  each user, and a button to initiate the payment process with
                  metamask for each user. The "outstanding balance" for the user
                  would be the user's token balance on our website (hftBal) MINUS the
                  tokens the user received on the blockchain (hftBlockchainSent). Since users can
                  earn more tokens, we need to keep track of how much has been
                  sent on the blockchain, and calculate the outstanding balance.
                  If a user did not link an ERC address, we can say N/A instead
                  of payment button.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminOnly;
