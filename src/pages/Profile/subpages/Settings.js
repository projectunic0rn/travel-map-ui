import React from "react";
import PropTypes from "prop-types";

import { Mutation } from "react-apollo";
import { DELETE_USER } from "../../../GraphQL";

function Settings({ history }) {
  function onRemoveUser() {
    localStorage.removeItem("token");
    history.push("/");
  }

  function onRemoveUserClick(loading, mutation) {
    if (!loading) {
      let approval = window.confirm(
        "You are about to delete your account, this cannot be undone. Are you sure?"
      );
      // TODO: Use context to set the userLoggedIn state to false
      if (approval) {
        return mutation();
      }
    }
  }

  return (
    <div className="content">
      <div className="settings-container">
        <h1>Settings</h1>
        <Mutation
          mutation={DELETE_USER}
          onCompleted={onRemoveUser}
          onError={(err) => alert("Unable to delete account" + err)}
        >
          {(mutation, { loading }) => (
            <div
              className={`delete-button ${loading ? "disabled" : ""}`}
              onClick={() => onRemoveUserClick(loading, mutation)}
            >
              Delete Account
            </div>
          )}
        </Mutation>
      </div>
    </div>
  );
}

Settings.propTypes = {
  history: PropTypes.object.isRequired
};

export default Settings;
