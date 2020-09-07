import React, { PureComponent } from "react";

class Footer extends PureComponent {
  render() {
    return (
      <div className="footer-container">
        <div className="footer-links-container"></div>
        <div className="footer-bottom-container">
          <span>
            ©Geornal is a hobby project built as part of the{" "}
            <a href="https://projectunicorn.net/">Project-Unicorn</a>
            programming group
          </span>
          <span>geornal.contact@gmail.com</span>
        </div>
      </div>
    );
  }
}

export default Footer;
