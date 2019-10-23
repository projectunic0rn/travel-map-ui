import React, { useState } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import ValidationMutation from "../../../../components/common/ValidationMutation/ValidationMutation";

import { DELETE_USER, CHANGE_PASSWORD } from "../../../../GraphQL";
import { UserConsumer } from "../../../../utils/UserContext";

export default function Security({ history }) {
  let [inputValues, setInputValues] = useState({
    oldPassword: "",
    password: "",
    password2: ""
  });
  let [errors, setErrors] = useState({
    oldPassword: null,
    password: null,
    password2: null
  });

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

  function handleInput(e) {
    console.log({[e.target.id]: e.target.value})
    let newValue = Object.assign(inputValues, {
      [e.target.id]: e.target.value
    });
    console.log(newValue);

    setInputValues(newValue);
    console.log(inputValues);
  }

  function onInputError(e) {
    console.log(e);
  }

  return (
    <div className="settings-security-container">
      <span className="security-header">Change Password</span>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <span className="security-subheader">OLD PASSWORD</span>
        <input
          onChange={handleInput}
          className="security-password-input"
          noValidate
          type="password"
          data-ng-model="password"
          required
          name="password"
          id="oldPassword"
        ></input>
        {errors.oldPassword && (
          <span className="validate">{errors.oldPassword}</span>
        )}
        <span className="security-subheader">NEW PASSWORD</span>
        <input
          onChange={handleInput}
          className="security-password-input"
          noValidate
          type="password"
          data-ng-model="password"
          required
          name="password"
          id="password"
        ></input>
        {errors.password && <span className="validate">{errors.password}</span>}
        <span className="security-subheader">CONFIRM NEW PASSWORD</span>
        <input
          onChange={handleInput}
          className="security-password-input"
          noValidate
          type="password"
          data-ng-model="password"
          required
          name="password"
          id="password2"
        ></input>
        {errors.password2 && (
          <span className="validate">{errors.password2}</span>
        )}
        <ValidationMutation
          variables={inputValues}
          mutation={CHANGE_PASSWORD}
          onCompleted={(data) => {
            console.log(data);
          }}
          onError={(err) => console.log(err)}
          onInputError={onInputError}
        >
          {(mutation, { loading }) => {
            return (
              <input
                onClick={() => {
                  console.log(inputValues);
                  mutation();
                }}
                className="submit-button"
                type="submit"
                value={loading ? "Submitting..." : "Submit"}
              />
            );
          }}
        </ValidationMutation>
      </form>
      <span className="security-header" style={{ marginTop: "12px" }}>
        Delete Account
      </span>
      <UserConsumer>
        {(value) => (
          <Mutation
            mutation={DELETE_USER}
            onCompleted={onRemoveUser}
            onError={(err) => alert("Unable to delete account" + err)}
          >
            {(mutation, { loading }) => (
              <div
                className={`security-delete-button ${
                  loading ? "disabled" : ""
                }`}
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
