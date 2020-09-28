import React, { PureComponent } from "react";
import avatar from "../../images/Avatar_trial1_rotate_12_purple.png";

class AvatarTwo extends PureComponent {
  render() {
    return <img src={avatar} style={{ width: "100%" }} alt="avatar" />;
  }
}

export default AvatarTwo;
