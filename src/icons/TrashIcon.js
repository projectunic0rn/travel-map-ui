import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class TrashIcon extends PureComponent {
  render() {
    return (
      <svg
        className="trash-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 14 18"
        width="14"
        height="18"
        onClick={() =>
          this.props.cityKey !== undefined
            ? this.props.trashClicked(this.props.cityKey)
            : null
        }
      >
        <path
          id="ic_delete_24px"
          transform="translate(-5 -3)"
          d="M 6 19 a 2.006 2.006 0 0 0 2 2 h 8 a 2.006 2.006 0 0 0 2 -2 V 7 H 6 Z M 19 4 H 15.5 l -1 -1 h -5 l -1 1 H 5 V 6 H 19 Z"
        />
      </svg>
    );
  }
}

TrashIcon.propTypes = {
  trashClicked: PropTypes.func,
  cityKey: PropTypes.number,
};

export default TrashIcon;
