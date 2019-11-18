import React, { Component } from 'react';

class CarIcon extends Component {
  render() {
    return (
      <svg
        className="transportation-icon car-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
      >
        <path
          className="layer2"
          d="M16 48v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4.2m56 0V52a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-4M24 34h16"
        />
        <path
          className="layer1"
          d="M54 22l-8-12H18l-8 12-8 8v15a3 3 0 0 0 3 3h54a3 3 0 0 0 3-3V30zM8.2 24H56M2 40h60M2 22h8m44 0h8"
        />
        <path className="layer1" d="M2 32h10l8 8m42-8H52l-8 8" />
      </svg>
    );
  }
}

export default CarIcon;