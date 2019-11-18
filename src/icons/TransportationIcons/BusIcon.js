import React, { Component } from 'react';

class BusIcon extends Component {
  render() {
    return (
      <svg
        className="transportation-icon bus-icon"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          stroke="#202020"
          fill="none"
          d="M29.1 8H35m-.9 30l10-10M20 54v6a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-6m44 0v6a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-6"
          className="layer2"
        />
        <path
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          stroke="#202020"
          fill="none"
          d="M16.1 46H22m20.1 0H48M8 16h48M8 38h48m6-8v8M2 30v8m54 16V6a4 4 0 0 0-4-4H12a4 4 0 0 0-4 4v48zM8 38l-6-6m54 6l6-6"
          className="layer1"
        />
      </svg>
    );
  }
}

export default BusIcon;