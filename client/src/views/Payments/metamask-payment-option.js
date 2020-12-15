import React, { Component } from "react";
import isEmpty from "lodash/isEmpty"
import ReactDOM from "react-dom";
import { AccountUnavailable } from "../Payments/account-unavailable";
import { WrongNetwork } from "../Payments/wrong-network";
import { ErrorWeb3 } from "../Payments/error-web3";
import "../../utils/metaMask";
import { isWeb3Available, createTransaction } from "../../utils/metaMask";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {loadComplete , updateTransactionUI, updateCurrentTransaction, sendTransaction} from "../../actions/paymentActions"
import {METAMASK_NETWORK_REQUIRED} from '../../utils/constants'

class MetaMaskPaymentOption extends React.Component{
    constructor(props){
        super(props);
        this.createTransaction = this.createTransaction.bind(this);
        this.transactionCallback = this.transactionCallback.bind(this);
    }
    render(){
        if(this.props.isTransactionInProgress){
            return (<div>Please complete the transaction in MetaMask to continue. Note: Don't close this window.</div>);
        }
        if (!isWeb3Available()) {
            return <ErrorWeb3/>;
        }
        else if (!this.props.networkId || this.props.networkId != METAMASK_NETWORK_REQUIRED) { 
            return <WrongNetwork />;
        }
        else if (!this.props.metaMaskAccounts || isEmpty(this.props.metaMaskAccounts)) {
            return <AccountUnavailable />;
        }

        return (          
            <button onClick={this.createTransaction} disabled={this.props.paymentAmount < 0 ||this.props.paymentAmount == null || this.props.paymentAmount == NaN}>Pay with Metamask</button>
        );
    }
    componentWillUnmount() {
        console.log("unmounted");
      }
    createTransaction(event){
        let r = this.props.paymentData.wallets.length - 1;
        const j = Math.floor(Math.random() * r);
        let transactionObject = {
            fromAddress :this.props.metaMaskAccounts[0],
            toAddress :  this.props.paymentData.wallets[j].publicKey,
            amount: this.props.paymentAmount
        }
        const isTranctionCreated = createTransaction(transactionObject,this.transactionCallback);
        if(isTranctionCreated){
            this.props.updateTransactionUI(true);
            this.props.updateCurrentTransaction(transactionObject);
        }
    }
    transactionCallback(err,result){
        if(!err){
            let currentTransaction = this.props.currentTransaction;
            currentTransaction.transactionId = result;
            currentTransaction.transactionMedium = 1;//1 is for metamask
            currentTransaction.paymentType = "ether";
            this.props.sendTransaction(currentTransaction);
        }
        this.props.updateTransactionUI(false);
        this.props.updateCurrentTransaction(null);
    }
  };


  MetaMaskPaymentOption.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    networkId: PropTypes.number.isRequired,
    loadComplete: PropTypes.func.isRequired,
    updateTransactionUI:PropTypes.func.isRequired,
    updateCurrentTransaction:PropTypes.func.isRequired,
    sendTransaction: PropTypes.func.isRequired,
    paymentData: PropTypes.object,
    metaMaskAccounts: PropTypes.array,
    paymentAmount: PropTypes.number.isRequired,
    isTransactionInProgress: PropTypes.bool.isRequired,
    currentTransaction: PropTypes.object
  };
  
  
  const mapStateToProps = state => ({
    isLoading: state.payment.isLoading,
    networkId: state.payment.networkId,
    paymentData: state.payment.paymentData,
    metaMaskAccounts: state.payment.metamaskAccounts,
    paymentAmount: state.payment.paymentAmount,
    isTransactionInProgress: state.payment.isTransactionInProgress,
    currentTransaction:state.payment.currentTransaction
  });
  
  export default connect(mapStateToProps,{loadComplete:loadComplete, updateTransactionUI:updateTransactionUI, updateCurrentTransaction:updateCurrentTransaction, sendTransaction:sendTransaction}) (MetaMaskPaymentOption);