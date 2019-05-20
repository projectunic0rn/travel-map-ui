import React from "react";
import PropTypes from 'prop-types';

function LoginForm(props) {
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
      <span className = 'login-button' onClick = {props.handleUserLogin}>login</span>
      <span className = 'form-switch'>I need to make an account. <span onClick={props.handleFormSwitch}>Sign up</span></span>
    </form>
  );
}

LoginForm.propTypes = {
    handleFormSwitch: PropTypes.func,
    handleUserLogin: PropTypes.func
}

export default LoginForm;
