import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import AvatarOne from "../../../icons/AvatarIcons/AvatarOne";
import AvatarTwo from "../../../icons/AvatarIcons/AvatarTwo";
import AvatarThree from "../../../icons/AvatarIcons/AvatarThree";
import AvatarFour from "../../../icons/AvatarIcons/AvatarFour";
import AvatarFive from "../../../icons/AvatarIcons/AvatarFive";
import AvatarSix from "../../../icons/AvatarIcons/AvatarSix";
import AvatarSeven from "../../../icons/AvatarIcons/AvatarSeven";
import AvatarEight from "../../../icons/AvatarIcons/AvatarEight";

import { UPDATE_USER_AVATAR } from "../../../GraphQL";

export default function AvatarGrid(props) {
  const [avatarIndex, handleAvatarIndex] = useState(
    props.userData.avatarIndex !== null ? props.userData.avatarIndex : 1
  );
  const [userAvatar, handleAvatarChange] = useState({
    avatarIndex: avatarIndex,
  });
  useEffect(() => {
    let avatar = userAvatar;
    handleAvatarChange(avatar);
  }, []);
  useEffect(() => {
    let avatar = userAvatar;
    if (avatarIndex !== props.avatarIndex) {
      avatar.avatarIndex = avatarIndex;
    }
    handleAvatarChange(avatar);
  }, [avatarIndex, props.avatarIndex]);

  return (
    <div className="user-avatar-grid-container">
      <div className="gravatar-info-container">
        <span className="gravatar-info-main">
          To add a custom image, make a{" "}
          <a href="https://gravatar.com">Gravatar.com</a> profile
        </span>
        <span className="gravatar-info-detail">
          Input your Gravatar email into Geornal to link the images
        </span>
      </div>
      <span className="avatar-grid-title">Choose an avatar</span>
      <div className="user-avatar-grid">
        <div
          className={
            avatarIndex === 1
              ? "avatar-grid-active avatar-grid-single"
              : "avatar-grid-single"
          }
          onClick={() => handleAvatarIndex(1)}
        >
          <AvatarOne />
        </div>
        <div
          className={
            avatarIndex === 2
              ? "avatar-grid-active avatar-grid-single"
              : "avatar-grid-single"
          }
          onClick={() => handleAvatarIndex(2)}
        >
          <AvatarTwo />
        </div>
        <div
          className={
            avatarIndex === 3
              ? "avatar-grid-active avatar-grid-single"
              : "avatar-grid-single"
          }
          onClick={() => handleAvatarIndex(3)}
        >
          <AvatarThree />
        </div>
        <div
          className={
            avatarIndex === 4
              ? "avatar-grid-active avatar-grid-single"
              : "avatar-grid-single"
          }
          onClick={() => handleAvatarIndex(4)}
        >
          <AvatarFour />
        </div>
        <div
          className={
            avatarIndex === 5
              ? "avatar-grid-active avatar-grid-single"
              : "avatar-grid-single"
          }
          onClick={() => handleAvatarIndex(5)}
        >
          <AvatarFive />
        </div>
        <div
          className={
            avatarIndex === 6
              ? "avatar-grid-active avatar-grid-single"
              : "avatar-grid-single"
          }
          onClick={() => handleAvatarIndex(6)}
        >
          <AvatarSix />
        </div>
      </div>
      <Mutation mutation={UPDATE_USER_AVATAR} variables={{ userAvatar }}>
        {(mutation) => (
          <span className="avatar-save-button" onClick={mutation}>
            Save
          </span>
        )}
      </Mutation>
    </div>
  );
}

AvatarGrid.propTypes = {
  avatarIndex: PropTypes.number,
  userData: PropTypes.object,
};
