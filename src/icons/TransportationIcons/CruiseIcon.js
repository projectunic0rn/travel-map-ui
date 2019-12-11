import React, { Component } from 'react';

class CruiseIcon extends Component {
  render() {
    return (
      <svg
        className="transportation-icon cruise-icon"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M29 14V2h8v12"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          stroke="#202020"
          fill="none"
          className="layer1"
        />
        <path
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          stroke="#202020"
          fill="none"
          d="M19 28.542V15.91A1.91 1.91 0 0 1 20.91 14h24.182A1.908 1.908 0 0 1 47 15.91v12.633"
          className="layer1"
        />
        <path
          d="M11 29.998L33 26l22 3.998m-28-9.999h12m-24.863 9.43a109.117 109.117 0 0 0 6.855 27.647m30.856-27.647a109.114 109.114 0 0 1-6.856 27.647M33 26v29.994"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          stroke="#202020"
          fill="none"
          className="layer1"
        />
        <path
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          stroke="#202020"
          fill="none"
          d="M9 55.994a5.996 5.996 0 0 0 11.992.082 5.996 5.996 0 0 0 11.992-.082m.016 0a5.996 5.996 0 0 0 11.992.082 5.996 5.996 0 0 0 11.992-.082"
          className="layer2"
        />
      </svg>
    );
  }
}

export default CruiseIcon;