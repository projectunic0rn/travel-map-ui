import React, { useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import UserContext from "../../../utils/UserContext";
import withMemo from '../../../utils/withMemo';


import UserAvatar from "../../UserAvatar/UserAvatar";
import UsernameDropdown from "./UsernameDropdown";

const UserHeaderContainer = React.memo(function UserHeaderContainer({ color, avatarIndex }) {
  const user = React.useContext(UserContext);

  const [dropdown, handleDropdownClick] = useState(false);
  function dropdownTrue() {
    handleDropdownClick(true);
  }
  function dropdownFalse() {
    handleDropdownClick(false);
  }
  return (
    <div className="user-header-container">
      <div className="user-link">
        <span
          className="header-username"
          onMouseOver={dropdownTrue}
        >
          <NavLink exact to="/profile/cities">
            {user.userData.username}
          </NavLink>
        </span>
        {dropdown ? (
          <UsernameDropdown onClickOut={dropdownFalse} />
        ) : null}
        <NavLink exact to="/profile/cities">
          <UserAvatar
            color={color}
            avatarIndex={avatarIndex}
            email={user.userData.email}
          />
        </NavLink>
      </div>
    </div>
  );
});

UserHeaderContainer.propTypes = {
  color: PropTypes.string,
  avatarIndex: PropTypes.number,
};

export default withMemo(UserHeaderContainer, []);
