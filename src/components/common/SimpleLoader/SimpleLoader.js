// copied from https://loading.io/css/

import React from "react";
import PropTypes from "prop-types";

function SimpleLoader({ color }) {
  return (
    <div className="lds-ring">
      <div
        style={{
          borderColor: `${color} transparent transparent transparent`
        }}
      ></div>
      <div
        style={{
          borderColor: `${color} transparent transparent transparent`
        }}
      ></div>
      <div
        style={{
          borderColor: `${color} transparent transparent transparent`
        }}
      ></div>
      <div
        style={{
          borderColor: `${color} transparent transparent transparent`
        }}
      ></div>
    </div>
  );
}

SimpleLoader.propTypes = {
  color: PropTypes.string
};

export default SimpleLoader;
