import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
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
  if (!isComponentVisible) {
    props.onClickOut();
  }
  return (
    <div ref={ref}>
      {isComponentVisible && (
        <div className="username-dropdown-container">
          <span className="username-dropdown-triangle" />
          <ul className="username-dropdown-links">
            <li className="ud-link">
              <PersonIcon />
              Profile
            </li>
            <li className="ud-link">
              <SettingsIcon />
              Settings
            </li>
            <li className="ud-link">
              <LogoutIcon />
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

UsernameDropdown.propTypes = {
  onClickOut: PropTypes.func
};

export default UsernameDropdown;
