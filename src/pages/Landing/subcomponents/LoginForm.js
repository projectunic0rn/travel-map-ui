import React, { Component } from 'react';

class UserLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      doShake: false,
      enabled: false,
      loginSuccess: false
    };
  }

 

  render() {
    const { enabled } = this.state;


    return (
      <form className = 'login-form' onSubmit={this.handleSubmit}>
        <div className="form-group">
          <span className="form-inline">
            <input
              name="username"
              type="text"
              className="form-control form-input"
              placeholder="username"
              value={this.state.username}
              onChange={this.handleChange}
            />
            <span className="floating-label" disabled>
              Username
            </span>
          </span>
          <span className="form-inline">
            <input
              name="password"
              type="password"
              minLength={8}
              className="form-control form-input"
              placeholder="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
            <span className="floating-label" disabled>
              Password
            </span>
          </span>
        </div>

        <div className="login-button">
          <input
            type="submit"
            value="Login"
            disabled={enabled ? false : true}
            className={enabled ? '' : 'btn-disabled'}
          />
        </div>
      </form>
    );
  }
}

export default UserLogin;