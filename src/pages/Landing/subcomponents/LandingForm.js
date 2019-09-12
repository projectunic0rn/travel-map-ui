import React, { useState } from "react";
import PropTypes from "prop-types";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import CloseWindowIcon from "../../../icons/CloseWindowIcon";

function LandingForm({ setFormIsOpen }) {
  const [formActive, handleFormSwitch] = useState(false);
  return (
    <div className="landing-form">
      <div
        onClick={() => setFormIsOpen(false)}
        className="close-icon-container"
      >
        <CloseWindowIcon />
      </div>
      <div className="landing-choice-container">
        <span
          className={
            formActive === false
              ? "landing-choice landing-choice-active"
              : "landing-choice"
          }
          onClick={() => handleFormSwitch(false)}
        >
          Login
        </span>
        <span style={{ color: "#747474" }}>or </span>
        <span
          className={
            formActive === true
              ? "landing-choice landing-choice-active"
              : "landing-choice"
          }
          onClick={() => handleFormSwitch(true)}
        >
          Sign Up
        </span>
      </div>
      <div className="landing-form-content">
        {formActive ? (
          <SignupForm
            setFormIsOpen={setFormIsOpen}
            handleFormSwitch={() => handleFormSwitch(false)}
          />
        ) : (
          <LoginForm
            setFormIsOpen={setFormIsOpen}
            handleFormSwitch={() => handleFormSwitch(true)}
          />
        )}
      </div>
    </div>
  );
}

LandingForm.propTypes = {
  setUserLoggedIn: PropTypes.func,
  setFormIsOpen: PropTypes.func
};

export default LandingForm;
