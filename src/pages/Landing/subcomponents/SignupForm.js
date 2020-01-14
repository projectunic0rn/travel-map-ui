import React, { Component } from "react";
import PropTypes from "prop-types";

import ValidationMutation from "../../../components/common/ValidationMutation/ValidationMutation";
import { SIGNUP_USER } from "../../../GraphQL";
import UserContext from "../../../utils/UserContext";

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      username: "",
      fullName: "",
      errors: {
        email: "",
        password: "",
        username: "",
        full_name: ""
      }
    };
  }

  handleInvalidCredentials(err) {
    this.setState({ errors: err });
  }

  async confirmSignup(data) {
    this.props.setFormIsOpen(false);
    this.saveUserData(data.loginUser.token);
    this.context.setUserLoggedIn(true);
  }

  saveUserData(token) {
    localStorage.setItem("token", token);
  }

  render() {
    const { username, fullName, password, email } = this.state;
    const { errors } = this.state;
    const { handleFormSwitch } = this.props;
    return (
      <form noValidate className="signup-form" onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          {errors.username && (
            <span className="validate">{errors.username}</span>
          )}
          <input
            type="text"
            required
            onChange={e => this.setState({ username: e.target.value })}
            name="username"
            id="username"
            placeholder="enter a username"
            maxLength={20}
          />
          <label htmlFor="username">username</label>
        </div>
        <div className="field">
          {errors.full_name && (
            <span className="validate">{errors.full_name}</span>
          )}
          <input
            type="text"
            required
            onChange={e => this.setState({ fullName: e.target.value })}
            name="fullname"
            id="fullname"
            placeholder="enter your full name"
            maxLength={60}
          />
          <label htmlFor="fullname">full name</label>
        </div>
        <div className="field">
          {errors.email && <span className="validate">{errors.email}</span>}
          <input
            type="email"
            onChange={(e) => this.setState({ email: e.target.value })}
            name="email"
            id="email"
            placeholder="enter your email address"
            maxLength={60}
          />
          <label htmlFor="email">email</label>
        </div>
        <div className="field">
          {errors.password && (
            <span className="validate">{errors.password}</span>
          )}
          <input
            type="password"
            data-ng-model="password"
            required
            onChange={e => this.setState({ password: e.target.value })}
            name="password"
            id="password"
            placeholder="enter a password"
            maxLength={60}
          />
          <label htmlFor="password">password</label>
        </div>
        <ValidationMutation
          mutation={SIGNUP_USER}
          variables={{ username, fullName, email, password }}
          onCompleted={(data) => this.confirmSignup(data)}
          onInputError={(err) => this.handleInvalidCredentials(err)}
        >
          {(mutation, { loading }) => (
            <button className="login-button button" onClick={mutation}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          )}
        </ValidationMutation>
        <span className="form-switch">
          I already have an account.
          <span onClick={handleFormSwitch}>Login</span>
        </span>
      </form>
    );
  }
}

SignupForm.contextType = UserContext;

SignupForm.propTypes = {
  handleFormSwitch: PropTypes.func,
  setUserLoggedIn: PropTypes.func,
  setFormIsOpen: PropTypes.func
};

export default SignupForm;
