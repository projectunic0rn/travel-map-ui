import React from "react";
import { NavLink, withRouter } from "react-router-dom";

function ReadonlySignupPrompt() {

  return (
    <div className="new-user-signup">
      <span className="new-user-signup-cta">
        To view friend reviews, signup below (free)
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

export default withRouter(ReadonlySignupPrompt);