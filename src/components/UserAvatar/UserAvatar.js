import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Gravatar from "react-gravatar";

import AvatarOne from "../../icons/AvatarIcons/AvatarOne";
import AvatarTwo from "../../icons/AvatarIcons/AvatarTwo";
import AvatarThree from "../../icons/AvatarIcons/AvatarThree";
import AvatarFour from "../../icons/AvatarIcons/AvatarFour";
import AvatarFive from "../../icons/AvatarIcons/AvatarFive";
import AvatarSix from "../../icons/AvatarIcons/AvatarSix";
// import AvatarSeven from "../../icons/AvatarIcons/AvatarSeven";
// import AvatarEight from "../../icons/AvatarIcons/AvatarEight";
import SimpleLoader from "../common/SimpleLoader/SimpleLoader";

const UserAvatar = React.memo(function UserAvatar({ color, avatarIndex, email }) {
  const [avatar, handleAvatar] = useState(<SimpleLoader />);
  useEffect(() => {
    let newAvatar = "";
    switch (avatarIndex) {
      case 1:
        newAvatar = <AvatarOne />;
        break;
      case 2:
        newAvatar = <AvatarTwo />;
        break;
      case 3:
        newAvatar = <AvatarThree  />;
        break;
      case 4:
        newAvatar = <AvatarFour  />;
        break;
      case 5:
        newAvatar = <AvatarFive />;
        break;
      case 6:
        newAvatar = <AvatarSix />;
        break;
      // case 7:
      //   newAvatar = <AvatarSeven />;
      //   break;
      // case 8:
      //   newAvatar = <AvatarEight />;
      //   break;
      default:
        newAvatar = <AvatarOne />;
        break;
    }
    handleAvatar(newAvatar);
  }, [avatarIndex, color]);

  return (
    <div className="user-avatar">
      {avatar}
      <Gravatar email={email} default="blank" className="gravatar" />
    </div>
  );
});

UserAvatar.propTypes = {
  color: PropTypes.string,
  avatarIndex: PropTypes.number,
  email: PropTypes.string,
};

export default React.memo(UserAvatar)
