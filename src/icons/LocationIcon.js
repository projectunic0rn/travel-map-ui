import React, { Component } from 'react';

class LocationIcon extends Component {
  render() {
    return (
      <svg
        className="location-icon"
        xmlns="http://www.w3.org/2000/svg"
        id="Layer_1"
        viewBox="0 0 14 20"
        x="0px"
        y="0px"
        width="14px"
        height="20px"
      >
        <path
          d="M 7 0 C 3.134 0 0 3.134 0 7 c 0 5.25 7 13 7 13 s 7 -7.75 7 -13 C 14 3.134 10.866 0 7 0 Z M 7 9.5 C 5.619 9.5 4.5 8.381 4.5 7 S 5.619 4.5 7 4.5 S 9.5 5.619 9.5 7 S 8.381 9.5 7 9.5 Z"
        />
      </svg>
    );
  }
}

export default LocationIcon;