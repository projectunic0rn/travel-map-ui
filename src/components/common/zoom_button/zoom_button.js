import React from "react";
import PropTypes from "prop-types";
import withMemo from '../../../utils/withMemo';

const ZoomButton = React.memo(function ZoomButton({
  type,
  handleViewportChange,
  currentZoom,
}) {
  function handleViewportChangeHelper() {
    handleViewportChange({
      zoom: type === "+" ? (currentZoom += 0.5) : (currentZoom -= 0.5),
    });
  }

  return <span onClick={handleViewportChangeHelper}>{type}</span>;
});

ZoomButton.propTypes = {
  type: PropTypes.string,
  handleViewportChange: PropTypes.func,
  currentZoom: PropTypes.number,
};

export default withMemo(ZoomButton, []);
