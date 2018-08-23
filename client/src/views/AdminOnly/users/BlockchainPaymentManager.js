import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import UserList from './user-list';
import {createHFTTransaction, isWeb3Available} from '../../../utils/metaMask'
import {createBlockchainTransactionOnAPI} from '../../../actions/adminActions';
import {loadComplete} from '../../../actions/paymentActions';
import { AccountUnavailable } from "../../Payments/account-unavailable";
import { WrongNetwork } from "../../Payments/wrong-network";
import { ErrorWeb3 } from "../../Payments/error-web3";
import {METAMASK_NETWORK_REQUIRED} from '../../../utils/constants'
import isEmpty from "lodash/isEmpty"


class BlockchainPaymentManager extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userEmail : "",
            userAddress : "",
            hftBal : 0,
            hftSentBal: 0,
            hftPendingBal: 0,
            amountToSend: 0,
            isTransactionInProgress: false,
            error:null,
            currentTransactionObject: null
        };
        this.onAmountChange = this.onAmountChange.bind(this);
        this.getTokenData = this.getTokenData.bind(this);
        this.transactionCallback = this.transactionCallback.bind(this);
        this.createBlockchainTransaction = this.createBlockchainTransaction.bind(this);
    }
    onAmountChange(event){
      let amountToSend = 0;
        if(event.target.value > (this.state.hftBal - this.state.hftSentBal - this.state.hftPendingBal)){
          amountToSend = (this.state.hftBal - this.state.hftSentBal - this.state.hftPendingBal);
        }
        else if(event.target.value < 0 )
        {
            amountToSend = 0;
        }
        else{
            amountToSend = event.target.value;
        }
        this.setState({amountToSend: amountToSend});
    }
    componentDidMount(){
      this.loadInterval = setInterval(this.props.loadComplete(this.props.paymentData, false),10000);
    }
    componentWillUnmount(){
      clearInterval(this.loadInterval);
    }
    render() {
        let info =<div> <div className="bit_card_title">Send Payment</div>
        <div className="bit_card_content">
          <div className="ico_flex_row flex_justified">
            <div>
              <input
                className="contribute_input"
                type="Number"
                placeholder={"Tokens to Send"}
                onChange= {this.onAmountChange}
                value = {this.state.amountToSend}
              />
            </div>
          </div>

          <div className="ico_flex_row">
            <div className="ico_contribute_left">Email:</div>
            <div className="ico_contribute_right">
              {this.state.userEmail}
            </div>
          </div>
          <div className="ico_flex_row">
            <div className="ico_contribute_left">Address: </div>
            <div className="ico_contribute_right">
              {this.state.userAddress}
            </div>
          </div>
          </div></div>;
        var error = null;
        if(this.props.isLoading){
          error = (<div>Loading... </div>);
        }
        if(this.state.isTransactionInProgress){
            error = (<div>Please complete the transaction in MetaMask to continue. Note: Don't close this window.</div>);
        }
        if (!isWeb3Available()) {
          error =  <ErrorWeb3/>;
        }
        else if (!this.props.networkId || this.props.networkId != METAMASK_NETWORK_REQUIRED) { 
            error =  <WrongNetwork />;
        }
        else if (!this.props.metaMaskAccounts || isEmpty(this.props.metaMaskAccounts)) {
            error =  <AccountUnavailable />;
            
        }
        return (
          <div>
            {error!=null && error}
            {error == null &&
            <div className="bit_card_container bit_full_width bit_mb_20">
             {info}
              <div className="pay_buttons">
                <button onClick={this.createBlockchainTransaction} disabled={this.state.amountToSend <= 0 ||this.state.amountToSend == null || this.state.amountToSend == NaN||this.state.userAddress == ''}>Pay with Metamask</button>
                {this.state.error && <div>{this.state.error}</div>}
              </div>
            </div>
            }
            <UserList sendTokens={this.getTokenData} enableSendTokens={error==null}/>
          </div>
        );
      }
      getTokenData(user){
        this.setState({
          userEmail:user.email,
          userAddress:user.ETH,
          hftBal : user.hftBal,
          hftSentBal: user.hftBlockchainSent,
          hftPendingBal: user.hftPendingBal,

        });
      }
      createBlockchainTransaction(){
        let transactionObject = {
          fromAddress :this.props.metaMaskAccounts[0],
          toAddress :  this.state.userAddress,
          tokens: this.state.amountToSend,
          userEmail: this.state.userEmail
        };
        createHFTTransaction(transactionObject, this.transactionCallback);
        this.setState({
          currentTransactionObject: transactionObject
        });
      }
      transactionCallback(error, txHash){
        if(error){
          console.log(error);
          this.setState({
            error:error.message,
            currentTransactionObject:null
          });
        }
        else{
          let transactionObject = this.state.currentTransactionObject;
          transactionObject.transactionId = txHash;
          this.props.createBlockchainTransaction(transactionObject);
          this.setState({
            error:null,
            transactionObject:null,
            amountToSend:0
          });
        }
      }
}

BlockchainPaymentManager.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  networkId: PropTypes.number.isRequired,
  loadComplete: PropTypes.func.isRequired,
  createBlockchainTransaction: PropTypes.func.isRequired,
  metaMaskAccounts: PropTypes.array,
  paymentData : PropTypes.object
};


const mapStateToProps = state => ({
  isLoading: state.payment.isLoading,
  networkId: state.payment.networkId,
  metaMaskAccounts: state.payment.metamaskAccounts,
  paymentData:state.payment.paymentData
});

export default connect(mapStateToProps,{loadComplete:loadComplete, createBlockchainTransaction:createBlockchainTransactionOnAPI}) (BlockchainPaymentManager);