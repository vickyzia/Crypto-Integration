import React, { Component } from "react";
import isEmpty from "lodash/isEmpty"
import ReactDOM from "react-dom";
import { AccountUnavailable } from "../MetaMask/account-unavailable";
import { WrongNetwork } from "../MetaMask/wrong-network";
import { ErrorWeb3 } from "../MetaMask/error-web3";
import "../../utils/metaMask";
import { isWeb3Available, createTransaction } from "../../utils/metaMask";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {loadComplete , updateTransactionUI, updateCurrentTransaction, sendTransaction} from "../../actions/paymentActions"

class MetaMaskPaymentOption extends React.Component{
    constructor(props){
        super(props);
        this.sendTransaction = this.createTransaction.bind(this);
        this.transactionCallback = this.transactionCallback.bind(this);
    }
    componentDidMount() {
        console.log("mounted");
        this.loadInterval = setInterval(()=>this.props.loadComplete(this.props.paymentData), 2000)
      }
    render(){
        if(this.props.isLoading || this.props.isLoading == undefined){
            return ("Loading..");
        }
        if(this.props.isTransactionInProgress){
            return ("Please complete the transaction in MetaMask to continue..");
        }
        if (!isWeb3Available()) {
            return <ErrorWeb3/>;
        }
        else if (!this.props.networkId || this.props.networkId != 1) { 
            return <WrongNetwork />;
        }
        else if (!this.props.metaMaskAccounts || isEmpty(this.props.metaMaskAccounts)) {
            return <AccountUnavailable />;
        }

        return (          
        <div className="pay_buttons">
            <button onClick={this.createTransaction} disabled={this.props.paymentAmount == 0 ||this.props.paymentAmount == null}>Pay with Metamask</button>
        </div>
        );
    }
    componentWillUnmount() {
        console.log("unmounted");
        clearInterval(this.loadInterval);
      }
    createTransaction(event){
        let r = this.props.paymentData.wallets.length - 1;
        const j = Math.floor(Math.random() * r);
        let transactionObject = {
            fromAddress :this.props.metaMaskAccounts[0],
            toAddress :  this.props.paymentData.wallets[j].publicKey,
            paymentAmount: this.props.paymentAmount
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