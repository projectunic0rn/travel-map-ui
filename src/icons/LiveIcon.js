import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class LiveIcon extends PureComponent {
  render() {
    const { className } = this.props;

    return (
      <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 17"
        width="20"
        height="17"
      >
        <path
          transform="translate(-2 -3)"
          d="M 10 20 V 14 h 4 v 6 h 5 V 12 h 3 L 12 3 L 2 12 H 5 v 8 Z"
        />
      </svg>
    );
  }
}

LiveIcon.propTypes = {
  className: PropTypes.string,
};

export default LiveIcon;
