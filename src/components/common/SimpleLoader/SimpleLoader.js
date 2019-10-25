// copied from https://loading.io/css/

import React from "react";
import PropTypes from "prop-types";

function SimpleLoader({ color }) {
  return (
    <div className="lds-ring" style={{ margin: "auto" }}>
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

SimpleLoader.defaultProps = {
  color: "#aaa"
};

export default SimpleLoader;
