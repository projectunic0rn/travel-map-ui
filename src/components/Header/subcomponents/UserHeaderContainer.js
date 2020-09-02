import React, { useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import UserContext from "../../../utils/UserContext";

import UserAvatar from "../../UserAvatar/UserAvatar";
import UsernameDropdown from "./UsernameDropdown";

function UserHeaderContainer({ color, avatarIndex }) {
  const user = React.useContext(UserContext);

  console.log("UserHeaderContainer");
  const [dropdown, handleDropdownClick] = useState(false);
  return (
    <div className="user-header-container">
      <div className="user-link">
        <span
          className="header-username"
          onMouseOver={() => handleDropdownClick(true)}
        >
          <NavLink exact to="/profile/cities">
            {user.userData.username}
          </NavLink>
        </span>
        {dropdown ? (
          <UsernameDropdown onClickOut={() => handleDropdownClick(false)} />
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
}

UserHeaderContainer.propTypes = {
  color: PropTypes.string,
  avatarIndex: PropTypes.number,
};

export default UserHeaderContainer;
