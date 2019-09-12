import React, { Component } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import Swal from "sweetalert2";
import socket from "../../../socket";
import { LOGIN_USER } from "../../../GraphQL";
import UserContext from "../../../utils/UserContext";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      username: "",
      buttonText: "login"
    };
  }
  async confirmLogin(data) {
    this._saveUserData(data.loginUser.token);
    this.context.setUserLoggedIn(true);
    this.props.setFormIsOpen(false);
  }
  _saveUserData(token) {
    localStorage.setItem("token", token);
    if (token) {
      socket.emit("user-connected", token);
    }
  }

  handleInvalidCredentials() {
    Swal.fire({
      type: "error",
      title: "Oops...",
      text: "Your credentials were invalid"
    });
  }

  render() {
    const { username, password } = this.state;
    const { handleFormSwitch } = this.props;
    return (
      <form
        className="signup-form"
        action=""
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="field">
          <input
            type="text"
            required
            onChange={(e) => this.setState({ username: e.target.value })}
            name="username"
            id="username"
            placeholder="enter a username"
          />
          <label htmlFor="username">username</label>
        </div>
        <div className="field">
          <input
            type="password"
            data-ng-model="password"
            autoComplete="on"
            required
            onChange={(e) => this.setState({ password: e.target.value })}
            name="password"
            minLength="4"
            id="password"
            placeholder="enter a password"
          />
          <label htmlFor="password">password</label>
        </div>
        <Mutation
          mutation={LOGIN_USER}
          variables={{ username, password }}
          onCompleted={(data) => this.confirmLogin(data)}
          onError={() => this.handleInvalidCredentials()}
        >
          {(mutation, { loading }) => (
            <div>
              <button className="login-button" onClick={mutation}>
                {!loading ? "Login" : "Logging in..."}
              </button>
            </div>
          )}
        </Mutation>
        <span className="form-switch">
          Don't have an account yet?{" "}
          <span onClick={handleFormSwitch}>Sign up</span>
        </span>
      </form>
    );
  }
}

LoginForm.contextType = UserContext;

LoginForm.propTypes = {
  handleFormSwitch: PropTypes.func,
  setUserLoggedIn: PropTypes.func,
  setFormIsOpen: PropTypes.func
};

export default LoginForm;
