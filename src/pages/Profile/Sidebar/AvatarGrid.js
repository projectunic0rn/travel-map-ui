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
  const color = props.customProps.color !== undefined ? props.customProps.color : "rgb(100, 100, 100)"
  const colorArray = color
    .substring(4, color.length - 1)
    .replace(/ /g, "")
    .split(",");
  const [avatarIndex, handleAvatarIndex] = useState(
    props.customProps.avatarIndex
  );
  const [red, handleRed] = useState(colorArray[0]);
  const [green, handleGreen] = useState(colorArray[1]);
  const [blue, handleBlue] = useState(colorArray[2]);
  const [userAvatar, handleAvatarChange] = useState({
    avatarIndex: avatarIndex,
    color: color
  });
  useEffect(() => {
    let avatar = userAvatar;
    if (red !== 100 || blue !== 100 || green !== 100) {
      let color = "rgb(" + red + ", " + green + ", " + blue + ")";
      avatar.color = color;
    }
    if (avatarIndex !== props.customProps.avatarIndex) {
      avatar.avatarIndex = avatarIndex;
    }
    handleAvatarChange(avatar);
  }, [red, blue, green, avatarIndex]);
  function handleAvatarSave() {
    props.customProps.closePopup();
    props.customProps.refetch();
  }
  return (
    <div className="user-avatar-grid-container">
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
          "box-shadow": "20px 20px 20px 10px rgba(" + red + ", " + green + ", " + blue + ", 0.15)"
        }}
      >
        <div className="color-picker-input">
          <span className="color-picker-title">R</span>
          <input
            placeholder={red}
            onChange={e => handleRed(e.target.value)}
            type="number"
            min="0"
            max="255"
          ></input>
        </div>
        <div className="color-picker-input">
          <span className="color-picker-title">G</span>
          <input
            placeholder={green}
            onChange={e => handleGreen(e.target.value)}
            type="number"
            min="0"
            max="255"
          ></input>
        </div>
        <div className="color-picker-input">
          <span className="color-picker-title">B</span>
          <input
            placeholder={blue}
            onChange={e => handleBlue(e.target.value)}
            type="number"
            min="0"
            max="255"
          ></input>
        </div>
      </div>
      <Mutation
        mutation={UPDATE_USER_AVATAR}
        variables={{ userAvatar }}
        onCompleted={handleAvatarSave}
      >
        {mutation => (
          <span className="avatar-save-button" onClick={mutation}>
            Save
          </span>
        )}
      </Mutation>
    </div>
  );
}

AvatarGrid.propTypes = {
  customProps: PropTypes.object
};
