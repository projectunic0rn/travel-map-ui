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
  const color =
    props.userData.color !== null ? props.userData.color : "rgb(100, 100, 100)";
  const colorArray = color
    .substring(4, color.length - 1)
    .replace(/ /g, "")
    .split(",");
  const [avatarIndex, handleAvatarIndex] = useState(
    props.userData.avatarIndex !== null ? props.userData.avatarIndex : 1
  );
  const [red, handleRed] = useState(colorArray[0]);
  const [green, handleGreen] = useState(colorArray[1]);
  const [blue, handleBlue] = useState(colorArray[2]);
  const [userAvatar, handleAvatarChange] = useState({
    avatarIndex: avatarIndex,
    color: color,
  });
  console.log(userAvatar.avatarIndex)
  useEffect(() => {
    let avatar = userAvatar;
    if (red !== 100 || blue !== 100 || green !== 100) {
      let color = "rgb(" + red + ", " + green + ", " + blue + ")";
      avatar.color = color;
    }
    handleAvatarChange(avatar);
  }, [red, blue, green]);
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
        <span className = 'gravatar-info-main'>
          To add a custom image, make a {" "}
          <a href="https://gravatar.com">Gravatar.com</a> profile
        </span>
        <span className = 'gravatar-info-detail'>
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
          <AvatarOne color={"rgb(" + red + ", " + green + ", " + blue + ")"} />
        </div>
        <div
          className={
            avatarIndex === 2
              ? "avatar-grid-active avatar-grid-single"
              : "avatar-grid-single"
          }
          onClick={() => handleAvatarIndex(2)}
        >
          <AvatarTwo color={"rgb(" + red + ", " + green + ", " + blue + ")"} />
        </div>
        <div
          className={
            avatarIndex === 3
              ? "avatar-grid-active avatar-grid-single"
              : "avatar-grid-single"
          }
          onClick={() => handleAvatarIndex(3)}
        >
          <AvatarThree
            color={"rgb(" + red + ", " + green + ", " + blue + ")"}
          />
        </div>
        <div
          className={
            avatarIndex === 4
              ? "avatar-grid-active avatar-grid-single"
              : "avatar-grid-single"
          }
          onClick={() => handleAvatarIndex(4)}
        >
          <AvatarFour color={"rgb(" + red + ", " + green + ", " + blue + ")"} />
        </div>
        <div
          className={
            avatarIndex === 5
              ? "avatar-grid-active avatar-grid-single"
              : "avatar-grid-single"
          }
          onClick={() => handleAvatarIndex(5)}
        >
          <AvatarFive color={"rgb(" + red + ", " + green + ", " + blue + ")"} />
        </div>
        <div
          className={
            avatarIndex === 6
              ? "avatar-grid-active avatar-grid-single"
              : "avatar-grid-single"
          }
          onClick={() => handleAvatarIndex(6)}
        >
          <AvatarSix color={"rgb(" + red + ", " + green + ", " + blue + ")"} />
        </div>
        <div
          className={
            avatarIndex === 7
              ? "avatar-grid-active avatar-grid-single"
              : "avatar-grid-single"
          }
          onClick={() => handleAvatarIndex(7)}
        >
          <AvatarSeven
            color={"rgb(" + red + ", " + green + ", " + blue + ")"}
          />
        </div>
        <div
          className={
            avatarIndex === 8
              ? "avatar-grid-active avatar-grid-single"
              : "avatar-grid-single"
          }
          onClick={() => handleAvatarIndex(8)}
        >
          <AvatarEight
            color={"rgb(" + red + ", " + green + ", " + blue + ")"}
          />
        </div>
      </div>
      <span className="avatar-grid-title">Choose a color</span>
      <div
        className="color-picker"
        style={{
          boxShadow:
            "20px 20px 20px 10px rgba(" +
            red +
            ", " +
            green +
            ", " +
            blue +
            ", 0.15)",
        }}
      >
        <div className="color-picker-input">
          <span className="color-picker-title">R</span>
          <input
            placeholder={red}
            onChange={(e) => handleRed(e.target.value)}
            type="number"
            min="0"
            max="255"
            maxLength={3}
          ></input>
        </div>
        <div className="color-picker-input">
          <span className="color-picker-title">G</span>
          <input
            placeholder={green}
            onChange={(e) => handleGreen(e.target.value)}
            type="number"
            min="0"
            max="255"
            maxLength={3}
          ></input>
        </div>
        <div className="color-picker-input">
          <span className="color-picker-title">B</span>
          <input
            placeholder={blue}
            onChange={(e) => handleBlue(e.target.value)}
            type="number"
            min="0"
            max="255"
            maxLength={3}
          ></input>
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
