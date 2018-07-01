import React, { Component } from "react";
import isEmpty from "lodash/isEmpty"
import ReactDOM from "react-dom";
import { AccountUnavailable } from "../MetaMask/account-unavailable";
import { WrongNetwork } from "../MetaMask/wrong-network";
import { ErrorWeb3 } from "../MetaMask/error-web3";
import "../../utils/metaMask";
import { isWeb3Available, getAccounts, getNetworkId } from "../../utils/metaMask";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {loadComplete} from "../../actions/paymentActions"

class MetaMaskPaymentOption extends React.Component{
    componentDidMount() {
        console.log("mounted");
        this.loadInterval = setInterval(()=>this.props.loadComplete(this.props.paymentData), 2000)
      }
    render(){
        console.log("networkId:" + this.props.networkId)
        console.log("isLoading:" + this.props.isLoading)
        if(this.props.isLoading || this.props.isLoading == undefined){
            return ("Loading..");
        }
        if (!isWeb3Available()) {
            return <ErrorWeb3/>;
        }
        else if (!this.props.networkId || this.props.networkId != 1) { 
            return <WrongNetwork />;
        }
        else if (isEmpty(getAccounts())) {
            console.log(getAccounts())
        return <AccountUnavailable />;
        }

        return (          
        <div className="pay_buttons">
            <button>Pay with Metamask</button>
        </div>
        );
    }
    componentWillUnmount() {
        console.log("unmounted");
        clearInterval(this.loadInterval);
      }
  };


  MetaMaskPaymentOption.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    networkId: PropTypes.number.isRequired,
    loadComplete: PropTypes.func.isRequired,
    walletList: PropTypes.array
  };
  
  
  const mapStateToProps = state => ({
    isLoading: state.payment.isLoading,
    networkId: state.payment.networkId,
    paymentData: state.payment.paymentData
  });
  
  export default connect(mapStateToProps,{loadComplete}) (MetaMaskPaymentOption);