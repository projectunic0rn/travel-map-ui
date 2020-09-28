import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Marker } from "@urbica/react-map-gl";

const style = {
  minHeight: "20px",
  minWidth: "20px",
  maxHeight: "50px",
  maxWidth: "50px",
  color: "#fff",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

class ClusterMarker extends PureComponent {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }
  onClick() {
    const { onClick, ...cluster } = this.props;
    onClick(cluster);
  }
  render() {
    const { color, latitude, longitude, pointCount } = this.props;
    return (
      <Marker longitude={longitude} latitude={latitude}>
        <div
          style={{
            ...style,
            width: pointCount * 2 + "px",
            height: pointCount * 2 + "px",
            background: color,
          }}
          offsetleft={-5}
          offsettop={-10}
          onClick={this.onClick}
        >
          {pointCount}
        </div>
      </Marker>
    );
  }
}

ClusterMarker.propTypes = {
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  pointCount: PropTypes.number,
  color: PropTypes.string,
  onClick: PropTypes.func,
};

export default ClusterMarker;
