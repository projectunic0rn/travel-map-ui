import React from "react";
import PropTypes from "prop-types";

const ZoomButton = React.memo(function ZoomButton({ type, handleViewportChange, currentZoom }) {
  return (
    <span
      onClick={() =>
        handleViewportChange({
          zoom: type === "+" ? (currentZoom += 0.5) : (currentZoom -= 0.5),
        })
      }
    >
      {type}
    </span>
  );
});

ZoomButton.propTypes = {
  type: PropTypes.string,
  handleViewportChange: PropTypes.func,
  currentZoom: PropTypes.number,
};

export default React.memo(ZoomButton)
