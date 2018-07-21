import React, { Component , Fragment} from "react";
import "../../utils/metaMask";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {createCPTransaction} from "../../actions/paymentActions"

class CoinPaymentsOption extends React.Component{
    constructor(props){
        super(props);
        this.createTransaction = this.createTransaction.bind(this);
    }
    render(){
        if(this.props.isCPTransactionInProgress){
            return (<div>Creating a CoinPayment Transaction.</div>);
        }
        return (
            <Fragment>    
                <div className="flex_row flex_justified">      
                    <button onClick={this.createTransaction} disabled={this.props.paymentAmount == 0 ||this.props.paymentAmount == null}>Pay with CoinPayment</button>
                </div>
                <div className="flex_row flex_justified align-center">{this.props.CPTransactionStatus == 1 ?
                    "Transaction created. " :
                    this.props.CPTransactionStatus == 2 ?
                    "Error creating transaction please try again.":""}
                    {this.props.CPTransactionStatus == 1&&<a href={this.props.CPLastPaymentLink} target='_blank'>Please click here to proceed.</a>}
                </div>
            </Fragment>
        );
    }
    createTransaction(event){
        let transactionObject = {
            amount: this.props.paymentAmount,
            paymentType:this.props.coinType
        }
        this.props.createCPTransaction(transactionObject);
    }
  };


  CoinPaymentsOption.propTypes = {
    paymentData: PropTypes.object,
    paymentAmount: PropTypes.number.isRequired,
    isCPTransactionInProgress: PropTypes.bool.isRequired,
    createCPTransaction: PropTypes.func.isRequired,
    coinType: PropTypes.string.isRequired,
    CPTransactionStatus : PropTypes.number,
    CPLastPaymentLink : PropTypes.string.isRequired
  };
  
  
  const mapStateToProps = state => ({
    paymentData: state.payment.paymentData,
    paymentAmount: state.payment.paymentAmount,
    isCPTransactionInProgress: state.payment.isCPTransactionInProgress,
    CPTransactionStatus: state.payment.CPTransactionStatus,
    coinType : state.payment.coinType,
    CPLastPaymentLink: state.payment.CPLastPaymentLink
  });
  
  export default connect(mapStateToProps,{createCPTransaction}) (CoinPaymentsOption);