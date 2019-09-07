import React from "react";
import { Mutation } from "react-apollo";

import { REMOVE_USER } from "../../../GraphQL";

export default function Settings({ history }) {
  function onRemoveUser() {
    localStorage.removeItem("token");
    history.push("/");
  }

  return (
    <div className="content">
      <div className="settings-container">
        <h1>Settings</h1>
        <Mutation
          mutation={REMOVE_USER}
          onCompleted={onRemoveUser}
          onError={(err) => console.log(`Error: ${err}`)}
        >
          {(mutation, { loading }) => (
            <div
              className={`delete-button ${loading ? "disabled" : ""}`}
              onClick={mutation}
            >
              Delete Account
            </div>
          )}
        </Mutation>
      </div>
    </div>
  );
}
