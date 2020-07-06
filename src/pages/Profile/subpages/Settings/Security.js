import React, { useState } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";

import Swal from "sweetalert2";

import ValidationMutation from "../../../../components/common/ValidationMutation/ValidationMutation";
import { DELETE_USER, CHANGE_PASSWORD } from "../../../../GraphQL";
import { UserConsumer } from "../../../../utils/UserContext";

export default function Security({ history }) {
  let [oldPassword, setOldPassword] = useState("");
  let [password, setPassword] = useState("");
  let [password2, setPassword2] = useState("");
  let [errors, setErrors] = useState({
    oldPassword: null,
    password: null,
    password2: null,
  });

  function onRemoveUser(setUserLoggedIn) {
    localStorage.removeItem("token");
    setUserLoggedIn(false);
    history.push("/");
  }

  function onRemoveUserClick(loading, mutation) {
    if (!loading) {
      let approval = window.confirm(
        "You are about to delete your account, this cannot be undone. Are you sure?"
      );
      if (approval) {
        mutation();
      }
    }
  }

  function handleInput(e) {
    if (e.target.id === "oldPassword") {
      setOldPassword(e.target.value);
    } else if (e.target.id === "password") {
      setPassword(e.target.value);
    } else {
      setPassword2(e.target.value);
    }
  }
  function onInputError(err) {
    setErrors(err);
  }

  function onPasswordChange() {
    Swal.fire({
      type: "success",
      text: "Password changed successfully",
      timer: "1200",
      showConfirmButton: false,
    });
    setOldPassword("");
    setPassword("");
    setPassword2("");
  }

  return (
    <div className="settings-security-container">
      <span className="security-header">Change Password</span>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <span className="security-subheader">OLD PASSWORD</span>
        <input
          className="input"
          value={oldPassword}
          onChange={handleInput}
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
          className="input"
          value={password}
          onChange={handleInput}
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
          className="input"
          value={password2}
          onChange={handleInput}
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
          variables={{ oldPassword, password, password2 }}
          mutation={CHANGE_PASSWORD}
          onCompleted={onPasswordChange}
          onInputError={onInputError}
        >
          {(mutation, { loading }) => (
            <input
              onClick={mutation}
              className="confirm button"
              type="submit"
              value={loading ? "Submitting..." : "Submit"}
            />
          )}
        </ValidationMutation>
      </form>
      <span className="security-header" style={{ marginTop: "12px" }}>
        Delete Account
      </span>
      <UserConsumer>
        {(value) => (
          <Mutation
            mutation={DELETE_USER}
            onCompleted={() => onRemoveUser(value.setUserLoggedIn)}
            onError={() => onRemoveUser(value.setUserLoggedIn)}
          >
            {(mutation, { loading }) => (
              <div
                className={`warning button ${loading ? "disabled" : ""}`}
                onClick={() => onRemoveUserClick(loading, mutation)}
              >
                Delete your account
              </div>
            )}
          </Mutation>
        )}
      </UserConsumer>
    </div>
  );
}

Security.propTypes = { history: PropTypes.object.isRequired };
