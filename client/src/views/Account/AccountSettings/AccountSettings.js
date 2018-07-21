import React, { Component } from "react";
import "./accountsettings.css";
import "../../../bit_common.css";
import ChangePassword from "./change-password";
import UpdateWallet from "./update-wallet";

class AccountSettings extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <div className="acc_settings_container">
          <div className="bit_card_container bit_full_width bit_mb_20">
            <div className="bit_card_title_fiverr">Fiverr Requirements</div>
            <div className="bit_card_content">
              <div className="bit_align_left">
                <p>Simply query the "ETH" for the logged in user and display below.  The forms are already functional.</p>
                <p>If possible, I would like the "Update Token Address" to be once every 24 hours.</p>
              </div>
            </div>
          </div>
          <div className="bit_card_container bit_full_width bit_mb_20">
            <div className="bit_card_title">Token Wallet</div>
            <div className="bit_card_content">
              <UpdateWallet />
            </div>
          </div>
          <div className="bit_card_container bit_full_width bit_mb_20">
            <div className="bit_card_title">Change Password</div>
            <div className="bit_card_content">
              <ChangePassword />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountSettings;
