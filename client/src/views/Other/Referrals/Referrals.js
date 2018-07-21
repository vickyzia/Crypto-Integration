import React, { Component } from "react";
import "./Referrals.css";
import "../../../bit_common.css";

class Referrals extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <div className="db_ref_container">
          <div className="bit_card_container bit_full_width bit_mb_20">
            <div className="bit_card_title_fiverr">Fiverr Requirements</div>
            <div className="bit_card_content">
              <div className="bit_align_left">
                <p>
                  Task #1: Query database for below information and display them
                  <ul>
                    <li>
                      Current Sponsor - Query 'sponsor' in database for the
                      logged in user, and return the email of the user that has
                      'sponsor' value as their 'refcode'. This will show the
                      sponsor of the logged in user. This value can be blank if
                      no sponsor entered during registration.
                    </li>
                    <li>
                      Referral Bonus Earned: Query and display the total tokens
                      earned from Level 1, 2, and 3 referrals
                    </li>
                      <li>
                        Total Level 1 Referrals: Query number of users that signed up
                        with the referral code of logged in user
                      </li>
                      <li>
                        Total Level 2 Referrals: Query number of all users that signed
                        up with referral code from Level 1 Referrals{" "}
                      </li>
                      <li>
                        Total Level 3 Referrals: Query number of all users that signed
                        up with referral code from Level 2 Referrals
                      </li>
                  </ul>
                </p>
              </div>
            </div>
          </div>
          <div className="bit_card_container bit_full_width">
            <div className="bit_card_title">My Network</div>
            <div className="bit_card_content">
              <div className="db_ref_section3_content">
                <div className="db_ref_flex_row">
                  <div className="db_ref_card_left3">Current Sponsor:</div>
                  <div className="db_ref_card_right3">-</div>
                </div>
                <div className="db_ref_flex_row">
                  <div className="db_ref_card_left3">
                    Referral Bonus Earned:
                  </div>
                  <div className="db_ref_card_right3">-</div>
                </div>
                <div className="db_ref_flex_row">
                  <div className="db_ref_card_left3">Level 1 Referrals</div>
                  <div className="db_ref_card_right3">-</div>
                </div>
                <div className="db_ref_flex_row">
                  <div className="db_ref_card_left3">Level 2 Referrals</div>
                  <div className="db_ref_card_right3">-</div>
                </div>
                <div className="db_ref_flex_row">
                  <div className="db_ref_card_left3">Level 3 Referrals</div>
                  <div className="db_ref_card_right3">-</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Referrals;
