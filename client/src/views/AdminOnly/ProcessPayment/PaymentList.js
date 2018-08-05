import React, { Component } from "react";
import PropTypes from "prop-types";
import {loadUnprocessedTransactions,  processTransaction} from "../../../actions/adminActions";
import { connect } from "react-redux";
import "../../Payments/payments.css";

class PaymentList extends Component{
    constructor(props){
        super(props);
        this.props.loadUnprocessedTransactions();
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
                        <th scope="col">Process</th>
                    </tr>
                </thead>
                <tbody>
                    {(!this.props.transactionList || this.props.transactionList.length == 0)&& "No Unprocessed Transactions to show."}
                    {this.props.transactionList && this.props.transactionList.map((transaction, index) => (
                        <React.Fragment key={transaction._id}>
                            <tr>
                                <td scope="row" className="table-col-large">{transaction.transactionId}</td>
                                <td className="table-col-small">{transaction.amount}</td>
                                <td className="table-col-large">{transaction.toAddress}</td>
                                <td className="table-col-medium">{transaction.transactionStatus}</td>
                                <td className="table-col-medium">
                                    {transaction.isProcessed == false?
                                            <button onClick={this.onProcessClick.bind(this, transaction)} disabled={transaction.isUpdating}>Process</button>
                                                :"Processed"}</td>                            
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
    onProcessClick(transaction){
        console.log(transaction);
        this.props.processTransaction(transaction);
    }
}
PaymentList.propTypes = {
    transactionList: PropTypes.array,
    loadUnprocessedTransactions: PropTypes.func.isRequired,
    processTransaction: PropTypes.func.isRequired
  };
  
  
  const mapStateToProps = state => ({
    transactionList: state.admin.unprocessedTransactions
  });
  
  export default connect(mapStateToProps,{loadUnprocessedTransactions,processTransaction}) (PaymentList);