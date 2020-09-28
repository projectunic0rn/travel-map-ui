import React, { PureComponent } from "react";
import avatar from "../../images/Avatar_trial8_rotate_12_yellow.png";

class AvatarOne extends PureComponent {
  render() {
    return <img src={avatar} style={{ width: "100%" }} alt="avatar" />;
  }
}

export default AvatarOne;
