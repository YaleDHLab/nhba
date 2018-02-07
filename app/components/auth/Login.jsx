import React from "react";
import request from "superagent";
import api from "../../../config";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      message: null,
    };

    this.handleKey = this.handleKey.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.submit = this.submit.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
  }

  handleKey(e) {
    if (e.charCode == 13) this.submit();
  }

  updateEmail(e) {
    this.setState({ email: e.target.value });
  }

  updatePassword(e) {
    this.setState({ password: e.target.value });
  }

  submit() {
    var user = {
      email: this.state.email,
      password: this.state.password,
    };

    request
      .post(api.endpoint + "login")
      .send(user)
      .set("Accept", "application/json")
      .end(this.handleResponse);
  }

  handleResponse(err, res) {
    const self = this;
    if (err) {
      console.warn(err);
    } else {
      if (res.body.message) {
        self.setState({ message: res.body.message });
      }
    }

    self.props.getSessionData();
    if (res.status && res.status === 200) {
      window.setTimeout(function() {
        self.props.hideAuth();
      }, 500);
    }
  }

  render() {
    const message = this.state.message;

    return (
      <div className="login">
        <h1>Welcome</h1>

        <div className="authenticate-input-container">
          <input
            type="text"
            className="full-width"
            onKeyPress={this.handleKey}
            onChange={this.updateEmail}
            placeholder="Email"
            value={this.state.email}
          />

          <input
            type="password"
            className="full-width"
            onKeyPress={this.handleKey}
            onChange={this.updatePassword}
            placeholder="Password"
            value={this.state.password}
          />
        </div>

        <div
          className="forgot-password-button"
          onClick={this.props.forgotPassword}
        >
          Forgot password?
        </div>

        <div className="modal-button-container">
          <div className="modal-button" onClick={this.submit}>
            Sign In
          </div>
        </div>

        {message ? <div className="message">{message}</div> : null}
      </div>
    );
  }
}
