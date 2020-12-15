import React from 'react';
import axios from "axios";
import PayoutList from './payout-list';
import {loadAdminPayouts} from "../../../actions/adminActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class AdminPayout extends React.Component{
    constructor(){
      super();
        this.state = {
            userEmail:"",
            tokens:0,
            errors:{}
        };
        this.onAmountChange = this.onAmountChange.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
        this.sendTokens = this.sendTokens.bind(this);

    }
    render() {
        return (
            <div className="bit_card_container bit_full_width bit_mb_20">
              <div className="bit_card_title">Admin Payout</div>
              <div className="bit_card_content">
                <div className="ico_flex_row flex_justified">
                  <div>
                    <input
                      className="contribute_input"
                      type="number"
                      placeholder={
                        "Amount of tokens to send"
                      }
                      onChange={this.onAmountChange}
                      value = {this.state.tokens<=0?"":this.state.tokens}
                    />
                  </div>
                </div>
                <div className="ico_flex_row flex_justified">
                  <div>
                    <input
                      className="contribute_input"
                      type="text"
                      placeholder={
                        "User Email"
                      }
                      onChange={this.onEmailChange}
                      value = {this.state.userEmail}
                    />
                  </div>
                </div>
                <div className="pay_buttons">
                    <button onClick={this.sendTokens} disabled={this.state.tokens < 0 ||this.state.tokens == null || this.state.tokens == NaN}>Send Tokens</button>
                </div>
                <div>{this.state.errors.userEmail && this.state.errors.userEmail}</div>
                <div>{this.state.errors.tokenAmount && this.state.errors.tokenAmount}</div>
                <div>{this.state.errors.message && this.state.errors.message}</div>
              </div>
              <PayoutList />
            </div>
            
        );
      }
      onAmountChange(event) {
        this.setState({tokens : event.target.value});
      }
      onEmailChange(event) {
        this.setState({userEmail : event.target.value});
      }
      sendTokens(event){
          let tokenData={
              userEmail: this.state.userEmail,
              tokenAmount: this.state.tokens
          }
        axios
        .post("http://localhost:5000/api/admin/sendUserTokens", tokenData)
        .then(res => {
            console.log(res);
            this.setState({
                userEmail: "",
                tokenAmount:0
            });
            this.props.loadAdminPayouts();
        })
        .catch(err => {
            console.log(err);
            if(err.response.status ==403){
              this.props.history.push('/login');
            }
            this.setState({ errors: err.response.data });
        });
      }
}

AdminPayout.propTypes = {
    loadAdminPayouts: PropTypes.func.isRequired,
};

  
export default connect(null,{loadAdminPayouts}) (AdminPayout);