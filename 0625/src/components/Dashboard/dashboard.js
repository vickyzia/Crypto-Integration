import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import PurchaseForm from "./purchaseform.js";

class Dashboard extends Component {
  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
  }

  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
    this.props.history.push("/login");
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    return (
      <div className="dashbody">
        <div>
          <a
            href=""
            onClick={this.onLogoutClick.bind(this)}
            className="btn btn-default"
          >
            Logout
          </a>
        </div>
        <div>
            <PurchaseForm />
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);
