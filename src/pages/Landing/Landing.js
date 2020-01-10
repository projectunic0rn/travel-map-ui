import React, { Component } from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from "react-simple-maps";
import jsonData from "../../world-topo-min.json";

const placeWords = [
  "INTERESTING",
  "DIVERSE",
  "EXCITING",
  "UNIQUE",
  "BEAUTIFUL"
];

class Landing extends Component {
  constructor(props) {
    super(props);

    // declare it class-wide so that it can be demounted
    this.wordIndexInterval = undefined;

    this.state = {
      activeTab: "loginTab",
      wordIndex: 0
    };

    this.setActive = this.setActive.bind(this);
    this.changeWordIndex = this.changeWordIndex.bind(this);
  }

  componentDidMount() {
    this.wordIndexInterval = setInterval(() => {
      this.changeWordIndex();
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.wordIndexInterval);
  }

  setActive(event) {
    this.setState({
      activeTab: event.target.id
    });
  }

  isActive(tab) {
    return tab === this.state.activeTab ? "activeTab" : "";
  }

  changeWordIndex() {
    let wordIndex = this.state.wordIndex;
    if (wordIndex === placeWords.length - 1) {
      wordIndex = -1;
    }
    wordIndex++;
    this.setState({
      wordIndex: wordIndex
    });
  }

  render() {
    const { wordIndex } = this.state;
    return (
      <div className="landing-container">
        <ComposableMap
          projectionConfig={{
            scale: 205
          }}
          width={980}
          height={600}
          style={{
            width: "100%",
            height: "auto",
            position: "absolute",
            zIndex: "-1",
            transform: "translateY(-36px)"
          }}
        >
          <ZoomableGroup
            center={this.state.center}
            zoom={this.state.zoom}
            disablePanning={true}
          >
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
                            fill: "#4b5463",
                            stroke: "#4b5463",
                            strokeWidth: 0.75,
                            outline: "none"
                          },
                          hover: {
                            fill: "#4b5463",
                            stroke: "#4b5463",
                            strokeWidth: 0.75,
                            outline: "none"
                          },
                          pressed: {
                            fill: "#4b5463",
                            stroke: "#4b5463",
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
        <div className="landing-motto-container">
          <div className="landing-motto">
            <span>Save travel memories.</span>
            <span>Help friends make their own.</span>
          </div>
          <div className="landing-motto-sub">
            <p>
              All of us are world travelers and none of us have seen the whole
              world. <br />
              We can all learn from each other to improve our own trips.
            </p>
            <p>
              Use Geornal to showcase your personal travel map, write reviews of
              your most memorable experiences, and see where your friends have
              been to help guide decisions on where to go next.
            </p>
          </div>
          <NavLink exact to={`/new`}>
            <button className="button new-map-button">Make my map</button>
          </NavLink>
          <div className="border-bar-container">
            <span className="landing-green-bar" />
            <span className="landing-red-bar" />
            <span className="landing-blue-bar" />
            <span className="landing-yellow-bar" />
          </div>
        </div>
        {/* <div className="landing-form-container">
          <LandingForm handleUserLogin={() => this.props.handleUserLogin(1)} />
        </div> */}
      </div>
    );
  }
}

Landing.propTypes = {
  handleUserLogin: PropTypes.func
};

export default withRouter(Landing);
