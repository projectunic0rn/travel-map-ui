import React, { Component } from 'react';

class SaveIcon extends Component {
  render() {
    return (
      <svg
        className='save-icon'
        xmlns="http://www.w3.org/2000/svg"
        id="Layer_1"
        viewBox="0 0 18 18"
        x="0px"
        y="0px"
        width="18px"
        height="18px"
      >
        <path
        fill="rgb(138, 181, 209)"
          id="ic_save_24px"
          d="M 14 0 H 2 C 0.896 0 0 0.896 0 2 v 14 c 0 1.104 0.896 2 2 2 h 14 c 1.104 -0.004 1.996 -0.896 2 -2 V 4 L 14 0 Z M 9 16 c -1.657 0 -3 -1.344 -3 -3 s 1.343 -3 3 -3 c 1.656 0 3 1.344 3 3 S 10.656 16 9 16 Z M 12 6 H 2 V 2 h 10 V 6 Z"
        />
      </svg>
    );
  }
}

export default SaveIcon;