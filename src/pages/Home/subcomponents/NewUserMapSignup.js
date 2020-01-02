import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

export default function NewUserMapSignup(props) {
  useEffect(() => {
    localStorage.setItem(
      "clickedCityArray",
      JSON.stringify(props.customProps.clickedCityArray)
    );
    localStorage.removeItem('token');
  }, []);
  return (
    <div className="new-user-signup">
      <span className="new-user-signup-cta">
        To save your map and share it with friends, signup below (free)
      </span>
      <NavLink
        to={{
          pathname: "/",
          state: { userAuthenticated: false, loginTab: 1 }
        }}
      >
        <button className="confirm button">Sign Up</button>
      </NavLink>
    </div>
  );
}

NewUserMapSignup.propTypes = {
  customProps: PropTypes.object
};
