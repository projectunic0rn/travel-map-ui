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
  avatarIndex,
  refetch
}) {
  const [avatarClick, handleAvatarClick] = useState(false);
  const [avatarHover, handleAvatarHover] = useState(false);
  function showPopup() {
    handleAvatarClick(false);
  }
  return (
    <div className="user-details-block">
      <div
        className="user-avatar-container"
        onClick={() => handleAvatarClick(true)}
        onMouseOver={() => handleAvatarHover(true)}
        onMouseOut={() => handleAvatarHover(false)}
      >
        {avatarHover ? (
          <span className="avatar-hover-text" style={{ opacity: 1 }}>
            Click to change avatar
          </span>
        ) : (
          <span className="avatar-hover-text" style={{ opacity: 0 }}>
            Click to change avatar
          </span>
        )}
        <UserAvatar color={color} avatarIndex={avatarIndex} />
      </div>
      {avatarClick ? (
        <PopupPrompt
          activePopup={true}
          showPopup={showPopup}
          component={AvatarGrid}
          componentProps={{
            color: color,
            avatarIndex: avatarIndex,
            closePopup: showPopup,
            refetch: refetch
          }}
        />
      ) : null}
      <div className="user-name-age">
        <span className="user-username">{username}</span>
        <span className="seperator">{age !== 0 ? ", " : null} </span>
        <span className="user-age">{age !== 0 ? age : null}</span>
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
  avatarIndex: PropTypes.number,
  refetch: PropTypes.func
};
