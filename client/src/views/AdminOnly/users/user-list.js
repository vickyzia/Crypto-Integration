import React, { Component } from "react";
import PropTypes from "prop-types";
import {loadUsers, updateUser} from "../../../actions/adminActions";
import { connect } from "react-redux";
import "../../Payments/payments.css";

class UserList extends Component{
    constructor(props){
        super(props);
        this.props.loadUsers();
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
                        <th scope="col">Tokens Sent</th>
                        <th scope="col">Tokens Pending</th>
                        <th scope="col">Enable/Disable</th>
                    </tr>
                </thead>
                <tbody>
                    {(!this.props.users || this.props.users.length == 0)&& "No Users  to show."}
                    {this.props.users && this.props.users.map((user, index) => (
                        <React.Fragment key={user._id}>
                            <tr>
                                <td scope="row" className="table-col-large">{user.email}</td>
                                <td className="table-col-small">{user.hftBal}</td>
                                <td className="table-col-large">{user.hftBlockchainSent}</td>
                                <td className="table-col-medium">{user.hftPendingBal}</td>
                                <td className="table-col-medium">
                                    <button onClick={this.onUpdateClick.bind(this, user)} disabled={user.isUpdating}>{user.isEnabled?"Disable":"Enable"}</button>
                                </td>
                                {(user.hftBal - user.hftBlockchainSent)>0 && 
                                <td className="table-col-medium">
                                    <button onClick={()=>this.props.sendTokens(user)} disabled={user.hftBlockchainSent>=(user.hftBal+user.hftPendingBal) || !this.props.enableSendTokens}>Send Tokens</button>
                                </td>
                            }                          
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
    onUpdateClick(user){
        this.props.updateUser(user);
    }
}
UserList.propTypes = {
    users: PropTypes.array,
    loadUsers: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired
  };
  
  
  const mapStateToProps = state => ({
    users: state.admin.users
  });
  
  export default connect(mapStateToProps,{loadUsers,updateUser}) (UserList);