import React, {
  useState,
  useRef,
  useEffect,
  lazy,
  Suspense,
  PureComponent,
  useCallback
} from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL, { Marker } from "react-map-gl";
import withMemo from "../../utils/withMemo";

import Loader from "../../components/common/Loader/Loader";
import ArrowRightIcon from "../../icons/ArrowRightIcon";

const FakeClickedCityContainer = lazy(() =>
  import("./subcomponents/FakeClickedCityContainer")
);
const FakeClickedFriendCityContainer = lazy(() =>
  import("./subcomponents/FakeClickedFriendCity")
);
// const FakeReviewCard = lazy(() => import("./subcomponents/FakeReviewCard"));
// const FakePlaceReviewCard = lazy(() =>
//   import("./subcomponents/FakePlaceReviewCard")
// );
const Footer = lazy(() => import("./Footer"));

class LoadedMarker extends PureComponent {
  render() {
    const {
      city,
      cityId,
      city_latitude,
      city_longitude,
      tripTiming,
    } = this.props;
    let color;
    switch (tripTiming) {
      case 0:
        color = "(203, 118, 120, ";
        break;
      case 1:
        color = "(115, 167, 195, ";
        break;
      case 2:
        color = "(150, 177, 168,";
        break;
      default:
        break;
    }
    return (
      <Marker
        key={cityId}
        latitude={city_latitude}
        longitude={city_longitude}
        offsetLeft={-5}
        offsetTop={-10}
      >
        <svg
          key={"svg" + cityId}
          height={20}
          width={20}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            style={{ fill: "rgba" + color + "0.25)" }}
            key={"circle" + cityId}
            cx="50"
            cy="50"
            r="50"
          />
          <circle
            style={{ fill: "rgba" + color + "1.0)" }}
            key={"circle2" + cityId}
            cx="50"
            cy="50"
            r="20"
          />
        </svg>
      </Marker>
    );
  }
}

function Landing() {
  const [viewport, handleViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight + 120,
    zoom: 0,
  });
  const mapRef = useRef();

  useEffect(() => {
    window.addEventListener("resize", resize);
    resize();
    return function cleanup() {
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resize() {
    handleViewportChangeMemo({
      width: window.innerWidth,
      height: window.innerHeight + 120,
      zoom: setInitialZoom(),
    });
  }

  function setInitialZoom() {
    let zoom;
    if (window.innerWidth <= 2 * window.innerHeight) {
      zoom = window.innerWidth * 0.0009;
    } else {
      if (window.innerHeight >= 500) {
        zoom = window.innerHeight * 0.0017;
      } else {
        zoom = window.innerHeight * 0.0008;
      }
    }
    return zoom;
  }

  const handleViewportChangeMemo = useCallback((newViewport) => {
    handleViewport({ ...viewport, ...newViewport });
  });

  return (
    <>
      <Suspense fallback={<Loader />}>
        <div className="landing-container">
          <div
            className="city-map-container"
            id="landing-map"
            style={{ zIndex: "-1" }}
          >
            <MapGL
              mapStyle={"mapbox://styles/mvance43776/ck5d5iota033i1iphduio56d1"}
              ref={mapRef}
              width="100%"
              {...viewport}
              mapboxApiAccessToken={
                "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
              }
              onViewportChange={handleViewportChangeMemo}
              style={{
                width: "100vw",
                minHeight: "calc(100%)",
                maxHeight: "calc(100% + 120px)",
                position: "relative",
              }}
            >
              <LoadedMarker
                city="Fremont"
                cityId={49220}
                city_latitude={37.5483}
                city_longitude={-121.9886}
                tripTiming={0}
              />
              <LoadedMarker
                city="Copenhagen"
                cityId={1748}
                city_latitude={55.67611}
                city_longitude={12.56889}
                tripTiming={0}
              />
              <LoadedMarker
                city="Rome"
                cityId={220}
                city_latitude={41.89306}
                city_longitude={12.48278}
                tripTiming={0}
              />
              <LoadedMarker
                city="Lagos"
                cityId={8673}
                city_latitude={6.45}
                city_longitude={3.4}
                tripTiming={0}
              />
              <LoadedMarker
                city="Stockholm"
                cityId={1754}
                city_latitude={59.32944}
                city_longitude={18.06861}
                tripTiming={1}
              />
              <LoadedMarker
                city="Brisbane"
                cityId={34932}
                city_latitude={-27.469}
                city_longitude={153.0235}
                tripTiming={2}
              />
            </MapGL>
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
        {/* <div className="landing-third-page">
          <div className="landing-additional-info-container">
            <div className="lp-additional-info">
              <span>2</span>
              <span>make geornal entries for your trips</span>
            </div>
          </div>
          <div className="landing-graphic-container">
            <div className="fake-review-container">
              <FakeReviewCard />
            </div>
          </div>
        </div> */}
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
        {/* <div className="landing-fifth-page">
          <div className="landing-additional-info-container">
            <div className="lp-additional-info">
              <span>4</span>
              <span>see all reviews for a city from multiple friends</span>
            </div>
          </div>{" "}
          <div className="landing-graphic-container">
            <div className="fake-review-container">
              <FakePlaceReviewCard />
            </div>
          </div>
        </div> */}
        <Footer />
      </Suspense>
    </>
  );
}

Landing.propTypes = {
  handleUserLogin: PropTypes.func,
};

export default withMemo(Landing, []);
