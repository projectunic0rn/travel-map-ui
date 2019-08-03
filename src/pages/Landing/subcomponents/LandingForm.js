import React, { useState } from "react";
import PropTypes from "prop-types";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

function LandingForm({ handleUserLogin, setFormIsOpen }) {
  const [formActive, handleFormSwitch] = useState(false);
  return (
    <div className="landing-form">
      <div className="landing-choice-container">
        <span
          className={
            formActive === 0
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
            formActive === 1
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
            handleUserLogin={handleUserLogin}
            handleFormSwitch={() => handleFormSwitch(false)}
          />
        ) : (
          <LoginForm
            setFormIsOpen={setFormIsOpen}
            handleUserLogin={handleUserLogin}
            handleFormSwitch={() => handleFormSwitch(false)}
          />
        )}
      </div>
    </div>
  );
}

LandingForm.propTypes = {
  handleUserLogin: PropTypes.func
};

export default LandingForm;
