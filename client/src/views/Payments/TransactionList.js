import React, { Component } from "react";
import PropTypes from "prop-types";
import {loadUserTransactions, confirmTransaction} from "../../actions/paymentActions";
import { connect } from "react-redux";
import "./payments.css";

class TransactionList extends Component{
    constructor(props){
        super(props);
        this.props.loadUserTransactions();
    }
    render(){
        return (
            <div className="ico_history_table_container">
            <div className="ico_history_table_scroll">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Transaction Id</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Receiver Address</th>
                        <th scope="col">Status</th>
                        <th scope="col">Confirmation</th>
                        <th scope="col">URL</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.transactionList && this.props.transactionList.map((transaction, index) => (
                        <React.Fragment key={transaction.transactionId}>
                            <tr>
                                <td scope="row" className="table-col-large">{transaction.transactionId}</td>
                                <td className="table-col-small">{transaction.amount}</td>
                                <td className="table-col-large">{transaction.toAddress}</td>
                                <td className="table-col-medium">{transaction.transactionStatus}</td>
                                <td className="table-col-medium">
                                    {transaction.transactionStatus == "pending"?
                                            <button onClick={this.onConfirmClick.bind(this,transaction.transactionId, index)} disabled={transaction.isUpdating}>Confirm</button>
                                                :"Confirmed"}</td>
                                <td className="table-col-medium">
                                {transaction.transactionMedium == 2 ? 
                                <a href={transaction.statusUrl}>{transaction.transactionStatus == "pending"?"Complete Payment":"Detail Link"}</a>:""} </td>
                            </tr>
                        </React.Fragment>
                    ))
                        
                    }

                </tbody>
            </table>
            </div>
            </div>
        );
    }
    onConfirmClick(key,index){
        this.props.confirmTransaction(index, key);
    }
}
TransactionList.propTypes = {
    transactionList: PropTypes.array,
    loadUserTransactions: PropTypes.func.isRequired,
    confirmTransaction: PropTypes.func.isRequired
  };
  
  
  const mapStateToProps = state => ({
    transactionList: state.payment.userTransactions.transactionList
  });
  
  export default connect(mapStateToProps,{loadUserTransactions, confirmTransaction}) (TransactionList);