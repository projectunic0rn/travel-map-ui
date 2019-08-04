import React, { Component } from "react";
import PropTypes from "prop-types";
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
    this.state = {
      activeTab: "loginTab",
      wordIndex: 0
    };

    this.setActive = this.setActive.bind(this);
    this.changeWordIndex = this.changeWordIndex.bind(this);
  }

  componentWillMount() {
    localStorage.clear();
    setInterval(() => {
      this.changeWordIndex();
    }, 5000);
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
          <span>THE WORLD IS FULL OF</span>
          <span className="rotating-word">{placeWords[wordIndex]}</span>
          <span>PLACES.</span>
          <span className="landing-motto-two">
            <span>explore</span> and <span>share</span> them.
          </span>
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

export default Landing;
