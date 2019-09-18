// copied from https://loading.io/css/

import React from "react";
import PropTypes from "prop-types";

function Loading({ borderColor }) {
  return (
    <div className="lds-ring">
      <div
        style={{
          borderColor: `${borderColor} transparent transparent transparent`
        }}
      ></div>
      <div
        style={{
          borderColor: `${borderColor} transparent transparent transparent`
        }}
      ></div>
      <div
        style={{
          borderColor: `${borderColor} transparent transparent transparent`
        }}
      ></div>
      <div
        style={{
          borderColor: `${borderColor} transparent transparent transparent`
        }}
      ></div>
    </div>
  );
}

Loading.propTypes = {
  borderColor: PropTypes.string
};

export default Loading;
