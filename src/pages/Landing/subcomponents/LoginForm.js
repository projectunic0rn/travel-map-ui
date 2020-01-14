import React, { Component } from "react";
import PropTypes from "prop-types";

import ValidationMutation from "../../../components/common/ValidationMutation/ValidationMutation";
import { LOGIN_USER } from "../../../GraphQL";
import UserContext from "../../../utils/UserContext";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      username: "",
      errors: {
        username: "",
        password: ""
      }
    };
  }
  async confirmLogin(data) {
    this._saveUserData(data.loginUser.token);
    this.context.setUserLoggedIn(true);
    this.props.setFormIsOpen(false);
  }
  _saveUserData(token) {
    localStorage.setItem("token", token);
  }

  handleInvalidCredentials(err) {
    this.setState({ errors: err });
  }

  render() {
    const { username, password } = this.state;
    const { handleFormSwitch } = this.props;
    const { errors } = this.state;
    return (
      <form
        className="signup-form"
        action=""
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="field">
          {errors.username && (
            <span className="validate">{errors.username}</span>
          )}
          <input
            noValidate
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
        {errors.password && (
            <span className="validate">{errors.password}</span>
          )}
          <input
            noValidate
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
        <ValidationMutation
          mutation={LOGIN_USER}
          variables={{ username, password }}
          onCompleted={(data) => this.confirmLogin(data)}
          onInputError={(err) => this.handleInvalidCredentials(err)}
        >
          {(mutation, { loading }) => (
            <div>
              <button
                className="login-button button"
                onClick={(e) => {
                  e.preventDefault();
                  mutation();
                }}
              >
                {!loading ? "Login" : "Logging in..."}
              </button>
            </div>
          )}
        </ValidationMutation>
        <span className="form-switch">
          {"Don't have an account yet?"}
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
