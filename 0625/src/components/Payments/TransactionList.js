import React, { Component } from "react";

class TransactionList extends Component{
    render(){
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Transaction Id</th>
                        <th scope="col">Amount</th>
                        <th scope="col">From</th>
                        <th scope="col">To</th>
                        <th scope="col">Status</th>
                        <th scope="col">Confirmation</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.transactionList.map(transaction => (
                        <React.Fragment key={transaction.transactionId}>
                            <tr>
                                <th scope="row">{transaction.Id}</th>
                                <td>{transaction.transactionId}</td>
                                <td>{transaction.amount}</td>
                                <td>{transaction.fromAddress}</td>
                                <td>{transaction.toAddress}</td>
                                <td>{transaction.status}</td>
                                <td>{transaction.status == "pending" && transaction.medium == "metamask"?<button>Confirm</button>:""}</td>
                            </tr>
                        </React.Fragment>
                    ))
                        
                    }

                </tbody>
            </table>
        );
    }
}