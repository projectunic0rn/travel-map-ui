import React from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";

import { DELETE_USER } from "../../../../GraphQL";
import { UserConsumer } from "../../../../utils/UserContext";

export default function Security({ history }) {
  function onRemoveUser() {
    localStorage.removeItem("token");
    history.push("/");
  }

  function onRemoveUserClick(loading, mutation, setUserLoggedIn) {
    if (!loading) {
      let approval = window.confirm(
        "You are about to delete your account, this cannot be undone. Are you sure?"
      );
      setUserLoggedIn(false);
      if (approval) {
        return mutation();
      }
    }
  }
  return (
    <div className="settings-security-container">
      <span className="security-header">Change Password</span>
      <span className="security-subheader">OLD PASSWORD</span>
      <input
        className="security-password-input"
        noValidate
        type="password"
        data-ng-model="password"
        autoComplete="on"
        required
        name="password"
        minLength="4"
        id="password"
      ></input>
      <span className="security-subheader">NEW PASSWORD</span>
      <input
        className="security-password-input"
        noValidate
        type="password"
        data-ng-model="password"
        autoComplete="on"
        required
        name="password"
        minLength="4"
        id="password"
      ></input>
      <span className="security-subheader">CONFIRM NEW PASSWORD</span>
      <input
        className="security-password-input"
        noValidate
        type="password"
        data-ng-model="password"
        autoComplete="on"
        required
        name="password"
        minLength="4"
        id="password"
      ></input>
      <span
        className="security-header"
        style={{ "margin-top": "12px" }}
      >
        Delete Account
      </span>
      <UserConsumer>
        {value => (
          <Mutation
            mutation={DELETE_USER}
            onCompleted={onRemoveUser}
            onError={err => alert("Unable to delete account" + err)}
          >
            {(mutation, { loading }) => (
              <div
                className={`security-delete-button ${loading ? "disabled" : ""}`}
                onClick={() =>
                  onRemoveUserClick(loading, mutation, value.setUserLoggedIn)
                }
              >
                  delete your account
              </div>
            )}
          </Mutation>
        )}
      </UserConsumer>
    </div>
  );
}

Security.propTypes = { history: PropTypes.object.isRequired };
