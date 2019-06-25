import React, { Component } from "react";
import PropTypes from "prop-types";
import { Mutation, compose, graphql } from "react-apollo";
import { SIGNUP_USER } from '../../../GraphQL';

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      username: "",
      fullName: ""
    };
  }
  async confirmSignup(data) {
    this._saveUserData(data.loginUser.token)
    this.props.handleUserLogin();
  }
  _saveUserData(token) {
    localStorage.setItem("token", token);
  }
  render() {
    const { username, fullName, password, email } = this.state;
    const { handleFormSwitch } = this.props;
    return (
      <form className="signup-form" action="" onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <input
            type="text"
            required
            onChange={e => this.setState({ username: e.target.value })}
            name="username"
            id="username"
            placeholder="enter a username"
          />
          <label htmlFor="username">username</label>
        </div>
        <div className="field">
          <input
            type="text"
            required
            onChange={e => this.setState({ fullName: e.target.value })}
            name="fullname"
            id="fullname"
            placeholder="enter your full name"
          />
          <label htmlFor="fullname">full name</label>
        </div>
        <div className="field">
          <input
            type="email"
            required
            onChange={e => this.setState({ email: e.target.value })}
            name="email"
            id="email"
            placeholder="enter your email address"
          />
          <label htmlFor="email">email</label>
        </div>
        <div className="field">
          <input
            type="password"
            data-ng-model="password"
            required
            onChange={e => this.setState({ password: e.target.value })}
            name="password"
            minLength="4"
            id="password"
            placeholder="enter a password"
          />
          <label htmlFor="password">password</label>
        </div>
        <Mutation
          mutation={SIGNUP_USER}
          variables={{ username, fullName, email, password }}
          onCompleted={data => this.confirmSignup(data)}
        >
          {mutation => (
            <button className="login-button" onClick={mutation}>
              sign up
            </button>
          )}
        </Mutation>
        <span className="form-switch">
          I already have an account.{" "}
          <span onClick={handleFormSwitch}>Login</span>
        </span>
      </form>
    );
  }
}

SignupForm.propTypes = {
  handleFormSwitch: PropTypes.func,
  handleUserLogin: PropTypes.func
};

export default compose(
  graphql(SIGNUP_USER, { name: 'signupUserMutation'}))(SignupForm);
