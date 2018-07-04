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
                    <React.Fragment>
                    
                        <tr>
                            <th scope="row"></th>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </React.Fragment>

                </tbody>
            </table>
        );
    }
}