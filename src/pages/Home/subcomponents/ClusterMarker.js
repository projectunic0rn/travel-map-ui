import React from "react";
import PropTypes from "prop-types";
import { Marker } from "@urbica/react-map-gl";

function ClusterMarker(props) {
  function onClick() {
    const { onClick, ...cluster } = props;
    onClick(cluster);
  }
  return (
    <Marker longitude={props.longitude} latitude={props.latitude}>
      <div
        style={{
          width: props.pointCount * 2 + "px",
          height: props.pointCount * 2 + "px",
          minHeight: "20px",
          minWidth: "20px",
          maxHeight: "50px",
          maxWidth: "50px",
          color: "#fff",
          background: props.color,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
        offsetleft={-5}
        offsettop={-10}
        onClick={onClick}
      >
        {props.pointCount}
      </div>
    </Marker>
  );
}

ClusterMarker.propTypes = {
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  pointCount: PropTypes.number,
  color: PropTypes.string,
  onClick: PropTypes.func
};

export default ClusterMarker;
