import React, { Component } from "react";
import "./dashboard_dashboard.css";
import "../../../bit_common.css";

class AccountSummary extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <div className="dbdb_container">
          <div className="bit_flex_column bit_full_width">
            <div className="bit_card_container bit_mb_20">
              <div className="bit_card_title_fiverr">Fiverr Requirements</div>
              <div className="bit_card_content">
                <div className="bit_align_left">
                  <p>
                    Account Summary: Simply query and show the current token
                    balance for the user
                  </p>
                  <p>
                    Payout History: This table shows all token payouts. There
                    are currently 3 types of token payouts.
                    <ul>
                      <li className="bit_mt_10">
                        Type #1: Purchase payout. Similar to the contribution
                        history table on 'payment' page, this table will show
                        'Type' (Purchase or Referral), 'transaction ID', 'payout
                        token amount', 'Payout status' (this is our internal
                        process status, not blockchain confirmation status),
                        'Date/Time of Payout'
                      </li>
                      <li className="bit_mt_10">
                        Type #2: Referral payout. User will receive token payout
                        if their referrals make a purchase. Put referral
                        email as transaction ID (or, if easier, just have 2
                        separate tables). Please see Referral Network for more
                        information
                        <ul>
                          <li>
                            For each Level 1 Referral purchase: The user receive 10% of
                            the purchase amount in tokens
                          </li>
                          <li>
                            For each Level 2 Referrals purchase: The user receive 5% of
                            the purchase amount in tokens
                          </li>
                          <li>
                            For each Level 3 Referrals purchase: The user receive 3% of
                            the purchase amount in tokens
                          </li>
                        </ul>
                      </li>
                      <li>
                          Type #3: Admin can send tokens to users. We can put "admin request" as transaction ID for this type of payouts.  See admin page for more information
                        </li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
            <div className="bit_card_container bit_mb_20">
              <div className="bit_card_title">Account Summary</div>
              <div className="bit_card_content">Token Balance: -</div>
            </div>
            <div className="bit_card_container bit_mb_20">
              <div className="bit_card_title">Payout History</div>
              <div className="bit_card_content">-</div>
            </div>
            <div className="bit_card_container">
              <div className="bit_card_title">Activity History</div>
              <div className="bit_card_content">-</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountSummary;
