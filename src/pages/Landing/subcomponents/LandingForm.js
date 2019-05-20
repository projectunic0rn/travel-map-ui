import React from "react";
import PropTypes from "prop-types";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const { useState } = React;

function LandingForm(props) {
  const [formActive, handleFormSwitch] = useState(0);
  return (
    <div className="landing-form">
      <div className="landing-choice-container">
        <span
          className={
            formActive === 0
              ? "landing-choice landing-choice-active"
              : "landing-choice"
          }
          onClick={() => handleFormSwitch(0)}
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
          onClick={() => handleFormSwitch(1)}
        >
          Sign Up
        </span>
      </div>
      <div className="landing-form-content">
        {formActive ? (
          <SignupForm
            handleUserLogin={props.handleUserLogin}
            handleFormSwitch={() => handleFormSwitch(0)}
          />
        ) : (
          <LoginForm
            handleUserLogin={props.handleUserLogin}
            handleFormSwitch={() => handleFormSwitch(1)}
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
