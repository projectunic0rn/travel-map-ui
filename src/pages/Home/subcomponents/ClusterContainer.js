import React from "react";
import PropTypes from "prop-types";
import Cluster from "@urbica/react-map-gl-cluster";
import ClusterMarker from "./ClusterMarker";
import withMemo from '../../../utils/withMemo';

const ClusterContainer = React.memo(function ClusterContainer({
 mapRef, extent, nodeSize, onClick, markerData, color }) {
    return (
      <Cluster
        ref={mapRef}
        radius={40}
        extent={extent}
        nodeSize={nodeSize}
        component={(cluster) => (
          <ClusterMarker
            onClick={onClick}
            color={color}
            {...cluster}
            type={1}
          />
        )}
      >
        {markerData}
      </Cluster>
    );
  })

ClusterContainer.propTypes = {};

export default withMemo(ClusterContainer, []);
