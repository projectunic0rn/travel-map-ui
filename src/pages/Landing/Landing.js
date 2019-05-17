import React, {Component} from "react";
import LoginForm from './subcomponents/LoginForm';

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
        <div className="landing-motto">
          <span>
            The world is full of
            <span className="rotating-word-container">
              <div className="sliding-words">
                <span id = 'interesting'>interesting</span>
                <span id = 'diverse'>diverse</span>
                <span id = 'exciting'>exciting</span>
                <span id = 'unique'>unique</span>
                <span id = 'beautiful'>beautiful</span>
              </div>
              <div
                className="rotating-word-width"
                style={{ width: this.state.widths[this.state.wordIndex] }}
              >
                <p>
                  <span>{this.state.placeWords[this.state.wordIndex]}</span>
                </p>
              </div>
            </span>
            <span className= 'landing-places'>places.</span>
          </span>
        </div>
        <div className="landing-motto">
          <p>
            <span className="motto-line-two">explore</span> &{" "}
            <span className="motto-line-two">share</span> them.
          </p>
        </div>
        <div className="form">
          <div className="tabs">
            <ul className="tab-group">
              <li className={this.isActive("loginTab")}>
                <a className="login-a" onClick={this.setActive} id="loginTab">
                  Log In
                </a>
              </li>
              <li className={this.isActive("signUpTab")}>
                <a className="login-a" onClick={this.setActive} id="signUpTab">
                  Sign Up
                </a>
              </li>
            </ul>
          </div>
          <div className = 'landing-form'>
            <LoginForm />
          </div>
          {/* <div className="tab-content">
          {activeTab === "loginTab" ? (
            <LoginForm loginRedirect={this.loginRedirect} />
          ) : (
            <SignUpForm />
          )}
        </div> */}
        </div>
      </div>
    );
  }
}

export default Landing;
