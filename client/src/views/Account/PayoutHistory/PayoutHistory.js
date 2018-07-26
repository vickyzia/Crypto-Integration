import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class PayoutHistory extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Payout Type</th>
                        <th scope="col">Transaction Id</th>
                        <th scope="col">Payout Token Amount</th>
                        <th scope="col">Payout Status</th>
                        <th scope="col">Date/Time</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.payoutHistory && this.props.payoutHistory.map((payout, index) => (
                        <React.Fragment key={payout._id}>
                            <tr>
                                <td scope="row" className="table-col-large">{payout.payoutType}</td>
                                <td className="table-col-small">{payout.transactionId}</td>
                                <td className="table-col-large">{payout.tokens}</td>
                                <td className="table-col-medium">{payout.payoutStatus}</td>
                                <td className="table-col-medium">{payout.createdAt}</td>    
                            </tr>
                        </React.Fragment>
                    ))
                        
                    }

                </tbody>
            </table>
        );
    }
}
PayoutHistory.propTypes = {
    payoutHistory: PropTypes.array,
  };
  
  
  const mapStateToProps = state => ({
    payoutHistory: state.payment.payoutHistory
  });
  
  export default connect(mapStateToProps,{}) (PayoutHistory);