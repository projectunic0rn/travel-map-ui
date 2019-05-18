import React from "react";
import PropTypes from 'prop-types';

function SignupForm(props) {
  return (
    <form className="signup-form" action="">
      <div className="field">
        <input
          type="text"
          required
          name="username"
          id="username"
          placeholder="enter a username"
        />
        <label htmlFor="username">username</label>
      </div>

      <div className="field">
        <input
          type="email"
          required
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
          name="password"
          minLength="6"
          id="password"
          placeholder="enter a password"
        />
        <label htmlFor="password">password</label>
      </div>
      <div className="field">
        <input
          type="password"
          required
          name="confirm-password"
          id="confirm-password"
          placeholder="enter a password"
        />
        <label htmlFor="confirm-password">confirm password</label>
      </div>
      <span className = 'login-button' onClick = {props.handleUserLogin}>sign up</span>
      <span className = 'form-switch'>I already have an account. <span onClick={props.handleFormSwitch}>Login</span></span>
    </form>
  );
}

SignupForm.propTypes = {
    handleFormSwitch: PropTypes.func,
    handleUserLogin: PropTypes.func
}

export default SignupForm;
