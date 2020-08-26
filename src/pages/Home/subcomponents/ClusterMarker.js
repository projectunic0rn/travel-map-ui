// import React from "react";
// import PropTypes from "prop-types";
// import { Marker } from "@urbica/react-map-gl";

// function ClusterMarker(props) {
//   function onClick() {
//     const { onClick, ...cluster } = props;
//     onClick(cluster);
//   }
//   return (
//     <Marker longitude={props.longitude} latitude={props.latitude}>
//       <div
//         style={{
//           width: props.pointCount * 2 + "px",
//           height: props.pointCount * 2 + "px",
//           minHeight: "20px",
//           minWidth: "20px",
//           maxHeight: "50px",
//           maxWidth: "50px",
//           color: "#fff",
//           background: props.color,
//           borderRadius: "50%",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center"
//         }}
//         offsetleft={-5}
//         offsettop={-10}
//         onClick={onClick}
//       >
//         {props.pointCount}
//       </div>
//     </Marker>
//   );
// }

// ClusterMarker.propTypes = {
//   latitude: PropTypes.number,
//   longitude: PropTypes.number,
//   pointCount: PropTypes.number,
//   color: PropTypes.string,
//   onClick: PropTypes.func
// };

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Marker } from "@urbica/react-map-gl";

class ClusterMarker extends PureComponent {
  onClick() {
    const { onClick, ...cluster } = this.props;
    onClick(cluster);
  }
  render() {
    return (
      <Marker longitude={this.props.longitude} latitude={this.props.latitude}>
        <div
          style={{
            width: this.props.pointCount * 2 + "px",
            height: this.props.pointCount * 2 + "px",
            minHeight: "20px",
            minWidth: "20px",
            maxHeight: "50px",
            maxWidth: "50px",
            color: "#fff",
            background: this.props.color,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          offsetleft={-5}
          offsettop={-10}
          onClick={this.onClick}
        >
          {this.props.pointCount}
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
