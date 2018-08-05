import React, { Component } from "react";
import PropTypes from "prop-types";
import {loadAdminPayouts} from "../../../actions/adminActions";
import { connect } from "react-redux";
import "../../Payments/payments.css";

class PayoutList extends Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
        this.props.loadAdminPayouts();
    }
    render(){
        return (
            <div className="ico_history_table_container">
            <div className="ico_history_table_scroll">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">User Email</th>
                        <th scope="col">Tokens</th>
                        <th scope="col">Payout Status</th>
                        <th scope="col">Date Created</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.payoutList && this.props.payoutList.map((payout, index) => (
                        <React.Fragment key={payout._id}>
                            <tr>
                                <td scope="row" className="table-col-large">{payout.transactionId}</td>
                                <td className="table-col-small">{payout.tokens}</td>
                                <td className="table-col-large">{payout.payoutStatus}</td>
                                <td className="table-col-small">{new Date(JSON.parse(JSON.stringify(payout.createdAt))).toLocaleString()}</td>
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
}
PayoutList.propTypes = {
    payoutList: PropTypes.array,
    loadAdminPayouts: PropTypes.func.isRequired,
};
  
  
  const mapStateToProps = state => ({
    payoutList: state.admin.payoutList
  });
  
  export default connect(mapStateToProps,{loadAdminPayouts}) (PayoutList);