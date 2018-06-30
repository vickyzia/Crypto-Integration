import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/reg_messages.css";

class Confirmation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: "",
      msg: ""
    };
  }

  componentDidMount() {
    console.log();
    let token = this.props.match.params.token;

    axios
      .get(`http://localhost:5000/api/users/confirmation/${token}`)
      .then(res => {
        console.log(res);
        this.setState({
          type: res.data.type,
          msg: res.data.msg
        });
      })
      .catch(err => {
        console.log(err.response.data);
        this.setState({
          type: err.response.data.type,
          msg: err.response.data.msg
        });
      });
  }
  render() {
    return (
      <div>
        <div className="full_screen_message_container">
          {this.state.type == "verified" ? (
            <div className="full_screen_message">
              Your account has been verified. Please{" "}
              <Link to="/login">Login</Link>
            </div>
          ) : (
            <div>
              {this.state.type == "already-verified" ? (
                <div className="full_screen_message">
                  {this.state.msg} Please <Link to="/login">Login</Link>
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Confirmation;
