import React, {
  lazy,
  Suspense,
} from "react";
import PropTypes from "prop-types";
import LandingImage from "../../images/MapLanding.png";

import Loader from "../../components/common/Loader/Loader";
import ArrowRightIcon from "../../icons/ArrowRightIcon";

const FakeClickedCityContainer = lazy(() =>
  import("./subcomponents/FakeClickedCityContainer")
);
const FakeClickedFriendCityContainer = lazy(() =>
  import("./subcomponents/FakeClickedFriendCity")
);
const Footer = lazy(() => import("./Footer"));

function Landing({ setFormIsOpen, formIsOpen }) {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <div className="landing-container">
          <div
            className="city-map-container"
            id="landing-map"
            style={{ zIndex: "-1" }}
          >
            <img src={LandingImage} alt="World map with markers"></img>
            <div className="img-below"></div>
          </div>
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
                Use Geornal to showcase your personal travel map, write reviews
                of your most memorable experiences, and see where your friends
                have been to help guide decisions on where to go next.
              </p>
            </div>
            {!formIsOpen ? <button className="button new-map-button" onClick={setFormIsOpen}>
              Make my map
            </button> : <button className="button new-map-button">
              Login
            </button>}
            <div className="border-bar-container">
              <span className="landing-green-bar" />
              <span className="landing-red-bar" />
              <span className="landing-blue-bar" />
              <span className="landing-yellow-bar" />
            </div>
          </div>
          <div className="arrow-container">
            <span>more info</span>
            <div className="arrow-down"></div>
          </div>
        </div>
        <div className="landing-second-page">
          <div className="landing-additional-info-container">
            <div className="lp-additional-info">
              <span>1</span>
              <span>add cities to your travel map</span>
            </div>
            <div className="map-search-container" id="landing-search-container">
              <input
                className="map-search"
                id="map-search-bar2"
                type="text"
                list="country-choice"
                name="country-search"
                value={"Banff, CA"}
                readOnly
              />
              <span className="arrow">
                <ArrowRightIcon />
              </span>
            </div>
            <div className="landing-graphic-container">
              <FakeClickedCityContainer />
            </div>
          </div>
        </div>
        <div className="landing-fourth-page">
          <div className="landing-additional-info-container">
            <div className="lp-additional-info">
              <span>2</span>
              <span>discover where friends have been</span>
            </div>
            <div className="map-search-container" id="landing-search-container">
              <input
                className="map-search"
                id="map-search-bar"
                type="text"
                list="country-choice"
                name="country-search"
                value={"Banff, CA"}
                readOnly
              />
              <span className="arrow">
                <ArrowRightIcon />
              </span>
            </div>
            <div className="landing-graphic-container">
              <FakeClickedFriendCityContainer />
            </div>
          </div>
        </div>
        <Footer />
      </Suspense>
    </>
  );
}

Landing.propTypes = {
  handleUserLogin: PropTypes.func,
};

export default Landing;
