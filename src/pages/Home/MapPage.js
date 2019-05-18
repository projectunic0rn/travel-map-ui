import React, { Component } from "react";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from "react-simple-maps";
import jsonData from "../../world-topo-min.json";

class MapPage extends Component {
  constructor() {
    super();
    this.state = {
      center: [0, 20],
      zoom: 1
    };
  }

  render() {
    return (
      <div className="map-container">
        <div className="map">
          <div>
            <ComposableMap
              projectionConfig={{
                scale: 205
              }}
              width={980}
              height={551}
              style={{
                width: "100%",
                height: "auto"
              }}
            >
              <ZoomableGroup center={this.state.center} zoom={this.state.zoom}>
                <Geographies geography={jsonData}>
                  {(geographies, projection) =>
                    geographies.map(
                      (geography, i) =>
                        geography.id !== "ATA" && (
                          <Geography
                            key={i}
                            geography={geography}
                            projection={projection}
                            style={{
                              default: {
                                fill: "#6E7377",
                                stroke: "rgb(100, 100, 100)",
                                strokeWidth: 0.75,
                                outline: "none"
                              },
                              hover: {
                                fill: "rgb(180, 180, 180)",
                                stroke: "rgb(180, 180, 180)",
                                strokeWidth: 0.75,
                                outline: "none",
                              },
                              pressed: {
                                fill: "#a7e1ff",
                                stroke: "#a7e1ff",
                                strokeWidth: 0.75,
                                outline: "none"
                              }
                            }}
                          />
                        )
                    )
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </div>
      </div>
    );
  }
}

export default MapPage;
