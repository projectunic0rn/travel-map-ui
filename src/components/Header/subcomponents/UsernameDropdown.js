import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import LogoutIcon from "../../../icons/LogoutIcon";
import PersonIcon from "../../../icons/PersonIcon";
import SettingsIcon from "../../../icons/SettingsIcon";

function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] = useState(
    initialIsVisible
  );
  const ref = useRef(null);

  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
}

function UsernameDropdown(props) {
  const { ref, isComponentVisible } = useComponentVisible(true);
  function logoutClicked() {
    localStorage.removeItem("token");
    props.handleUserLogout(0);
  }
  if (!isComponentVisible) {
    props.onClickOut();
  }
  return (
    <div ref={ref}>
      {isComponentVisible && (
        <div className="username-dropdown-container">
          <span className="username-dropdown-triangle" />
          <ul className="username-dropdown-links">
            <Link to="/profile" className="ud-link">
                <PersonIcon />
                Profile
            </Link>
            <Link to="/profile" className="ud-link">
                <SettingsIcon />
                Settings
            </Link>
            <Link to="/" onClick={logoutClicked} className="ud-link">
                <LogoutIcon />
                Logout

            </Link>
          </ul>
        </div>
      )}
    </div>
  );
}

UsernameDropdown.propTypes = {
  onClickOut: PropTypes.func,
  handleUserLogout: PropTypes.func
};

export default UsernameDropdown;
