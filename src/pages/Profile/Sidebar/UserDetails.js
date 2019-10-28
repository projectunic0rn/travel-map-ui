import React, { useState } from "react";
import PropTypes from "prop-types";
import UserAvatar from "../../../components/UserAvatar/UserAvatar";
import AvatarGrid from "./AvatarGrid";
import PopupPrompt from "../../../components/Prompts/PopupPrompt";

export default function UserDetails({
  username,
  age,
  city,
  country,
  color,
  avatarIndex
}) {
  const [avatarClick, handleAvatarClick] = useState(false);
  function showPopup() {
    handleAvatarClick(false);
  }
  return (
    <div className="user-details-block">
      <div
        className="user-avatar-container"
        onClick={() => handleAvatarClick(true)}
      >
        <UserAvatar color={color} avatarIndex={avatarIndex} />
      </div>
      {avatarClick ? (
        <PopupPrompt
          activePopup={true}
          showPopup={showPopup}
          component={AvatarGrid}
          componentProps={{
            color: color,
            avatarIndex: avatarIndex
          }}
        />
      ) : null}
      <div className="user-name-age">
        <span className="user-username">{username}</span>
        <span className="seperator">, </span>
        <span className="user-age">{age}</span>
      </div>
      <div className="user-location">
        <span className="city">{city}</span>
        <span className="seperator">, </span>
        <span className="country">{country}</span>
      </div>
    </div>
  );
}

UserDetails.propTypes = {
  username: PropTypes.string,
  age: PropTypes.number,
  city: PropTypes.string,
  country: PropTypes.string,
  color: PropTypes.string,
  avatarIndex: PropTypes.number
};
