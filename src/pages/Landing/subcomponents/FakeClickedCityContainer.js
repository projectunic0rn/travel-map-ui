import React from "react";

function FakeClickedCityContainer() {
  return (
    <div className="clicked-country-container" id="fake-clicked-city">
      <div className="clicked-country-header" />
      <div className="clicked-country-info">
        <div className="clicked-country-info-names">
          <span></span>
          <span>Auckland</span>
          <span>Country: New Zealand</span>
        </div>
      </div>
      <div className="clicked-country-timing-container">
        <span className="past-timing">I visited here</span>{" "}
        <span className="future-timing">I plan to visit here</span>{" "}
        <span className="live-timing">I live here currently</span>
      </div>
    </div>
  );
}

export default FakeClickedCityContainer;
