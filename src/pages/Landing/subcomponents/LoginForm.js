import React, { Component, } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Swal from 'sweetalert2'
import socket from "../../../socket";





const LOGIN_MUTATION = gql`
  mutation loginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      token
    }
  }
`;

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
    this.props.handleUserLogin();
  }
  _saveUserData(token) {
    localStorage.setItem("token", token);
    if (token) {
      socket.emit("user-connected", token)
    }
  }

  handleInvalidCredentials() {
    Swal.fire({
      type: 'error',
      title: 'Oops...',
      text: 'Your credentials were invalid'    })
  }

  render() {
    const { username, password } = this.state;
    const { handleFormSwitch } = this.state;
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
          mutation={LOGIN_MUTATION}
          variables={{ username, password }}
          onCompleted={data => this.confirmLogin(data)}
          onError={() => this.handleInvalidCredentials()}
        >
          {(mutation, { loading}) => (
            <div>
                <button className="login-button" onClick={mutation}>
                  { !loading ? 'Login' : "Logging in..."}
               </button>
            </div>
          
          )}
        </Mutation>
        <span className="form-switch">
          I need to make an account.{" "}
          <span onClick={handleFormSwitch}>Sign up</span>
        </span>
      </form>
    );
  }
}

LoginForm.propTypes = {
  handleFormSwitch: PropTypes.func,
  handleUserLogin: PropTypes.func
};

export default LoginForm;
