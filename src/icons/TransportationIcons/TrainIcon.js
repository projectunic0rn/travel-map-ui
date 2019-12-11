import React, { Component } from 'react';

class TrainIcon extends Component {
  render() {
    return (
      <svg
        className="transportation-icon train-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
      >
        <path
          className="layer2"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 62l11.7-6.1M56 62l-11.7-6.1"
        />
        <path
          className="layer1"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M42.3 40H46l4 14-18 6-18-6 4-14h3.6"
        />
        <path
          className="layer2"
          d="M36.3 22.9h1.3a8.2 8.2 0 0 0 4.4-1.3 4.8 4.8 0 0 0 7.8-5 4.5 4.5 0 0 0-.8-8.8l-1.5.3a3 3 0 0 0-4.3-1.9 4.9 4.9 0 0 0-9.5-.6 4.2 4.2 0 1 0-3.8 6.4 8.5 8.5 0 0 0-.5 2"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          className="layer1"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M32 46v14"
        />
        <circle
          className="layer1"
          cx="32"
          cy="34"
          r="12"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <circle
          className="layer1"
          cx="32"
          cy="34"
          r="4"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          className="layer1"
          fill="none"
          stroke="#202020"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M28 14v8.7m8 0V14m-10 0h12"
        />
      </svg>
    );
  }
}

export default TrainIcon;