import React, { Component } from "react";
import PropTypes from 'prop-types';
import LandingForm from "./subcomponents/LandingForm";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "loginTab",
      placeWords: ["interesting", "diverse", "exciting", "unique", "beautiful"],
      widths: [182, 82, 94, 66, 122],
      wordIndex: 0
    };

    this.setActive = this.setActive.bind(this);
    this.changeWordIndex = this.changeWordIndex.bind(this);
  }

  componentWillMount() {
    localStorage.clear();
    setTimeout(() => {
      setInterval(() => {
        this.changeWordIndex();
      }, 2500);
    }, 600);
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
    if (wordIndex === this.state.placeWords.length - 1) {
      wordIndex = -1;
    }
    wordIndex++;
    this.setState({
      wordIndex: wordIndex
    });
  }

  render() {
    return (
      <div className="landing-container">
        <div className="landing-motto-container">
          <span>the world is full of</span>
          <span className="rotating-word">beautiful</span>
          <span>places.</span>
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
        <div className="landing-form-container">
          <LandingForm handleUserLogin = {this.props.handleUserLogin}/>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  handleUserLogin: PropTypes.func
}

export default Landing;
