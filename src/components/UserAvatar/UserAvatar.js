import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Gravatar from "react-gravatar";

import AvatarOne from "../../icons/AvatarIcons/AvatarOne";
import AvatarTwo from "../../icons/AvatarIcons/AvatarTwo";
import AvatarThree from "../../icons/AvatarIcons/AvatarThree";
import AvatarFour from "../../icons/AvatarIcons/AvatarFour";
import AvatarFive from "../../icons/AvatarIcons/AvatarFive";
import AvatarSix from "../../icons/AvatarIcons/AvatarSix";
import AvatarSeven from "../../icons/AvatarIcons/AvatarSeven";
import AvatarEight from "../../icons/AvatarIcons/AvatarEight";
import SimpleLoader from "../common/SimpleLoader/SimpleLoader";

export default function UserAvatar({ color, avatarIndex, email }) {
  const [avatar, handleAvatar] = useState(<SimpleLoader />);
  useEffect(() => {
    let newAvatar = "";
    switch (avatarIndex) {
      case 1:
        newAvatar = <AvatarOne color={color} />;
        break;
      case 2:
        newAvatar = <AvatarTwo color={color} />;
        break;
      case 3:
        newAvatar = <AvatarThree color={color} />;
        break;
      case 4:
        newAvatar = <AvatarFour color={color} />;
        break;
      case 5:
        newAvatar = <AvatarFive color={color} />;
        break;
      case 6:
        newAvatar = <AvatarSix color={color} />;
        break;
      case 7:
        newAvatar = <AvatarSeven color={color} />;
        break;
      case 8:
        newAvatar = <AvatarEight color={color} />;
        break;
      default:
        newAvatar = <AvatarOne color="rgb(100, 100, 100)" />;
        break;
    }
    handleAvatar(newAvatar);
  }, [avatarIndex]);

  return (
    <div className="user-avatar">
      {avatar}
      <Gravatar email={email} default="blank" className="gravatar" />
    </div>
  );
}

UserAvatar.propTypes = {
  color: PropTypes.string,
  avatarIndex: PropTypes.number,
  email: PropTypes.string,
};
