import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL, { Marker, Popup } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";

import Loader from "../../../../components/common/Loader/Loader";

function PlanningMap({
  latitude,
  longitude,
  localCityReviews,
  friendReviews,
  handleLocalCityReviews,
  edit,
  page
}) {
  const [loaded, handleLoaded] = useState(false);
  const [viewport, handleViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: latitude,
    longitude: longitude,
    zoom: 7.5
  });
  const [bbox, handleBbox] = useState([]);
  const [loadingReviews, handleLoadingReviews] = useState(false);
  const [cityTooltip, handleCityTooltip] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    window.addEventListener("resize", resize);
    resize();
    handleLoaded(true);
    return function cleanup() {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      let newBBox = mapRef.current.getMap().getBounds();
      handleBbox([
        newBBox._sw.lng,
        newBBox._sw.lat,
        newBBox._ne.lng,
        newBBox._ne.lat
      ]);
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded) {
      let newBBox = mapRef.current.getMap().getBounds();
      handleBbox([
        newBBox._sw.lng,
        newBBox._sw.lat,
        newBBox._ne.lng,
        newBBox._ne.lat
      ]);
    }
  }, [viewport]);

  useEffect(() => {
    handleLoadingReviews(false);
    handleCityTooltip(null);
  }, [localCityReviews]);

  useEffect(() => {
    handleLoadingReviews(false);
    handleCityTooltip(null);
  }, [friendReviews]);

  function resize() {
    handleViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  function handleViewportChange(newViewport) {
    handleViewport({ ...viewport, ...newViewport });
  }

  function handleOnResult(event) {
    console.log(event);
    handleLoadingReviews(true);
    handleLocalCityReviews(event);
  }

  function determineColor(type) {
    let color = "";
    switch (type) {
      case "place":
        color = "#528FB1";
        break;
      case "nature":
        color = "#528FB1";
        break;
      case "stay":
        color = "#528FB1";
        break;
      case "monument":
        color = "#528FB1";
        break;
      case "dinner":
        color = "#B45B5D";
        break;
      case "breakfast":
        color = "#B45B5D";
        break;
      case "lunch":
        color = "#B45B5D";
        break;
      case "drink":
        color = "#B45B5D";
        break;
      case "dessert":
        color = "#B45B5D";
        break;
      case "activity":
        color = "#769F93";
        break;
      case "shopping":
        color = "#769F93";
        break;
      case "tour":
        color = "#769F93";
        break;
      case "outdoor":
        color = "#769F93";
        break;
    }
    return color;
  }

  function _renderPopup() {
    return (
      cityTooltip && (
        <Popup
          className="city-map-tooltip"
          tipSize={5}
          anchor="top"
          latitude={cityTooltip.review_latitude}
          longitude={cityTooltip.review_longitude}
          closeOnClick={false}
          closeButton={true}
          onClose={() => handleCityTooltip(null)}
        >
          {cityTooltip.attraction_name} <br />
        </Popup>
      )
    );
  }

  if (!loaded) return <Loader />;
  return (
    <>
      <div className="city-planning-map-container">
        <MapGL
          mapStyle={"mapbox://styles/mvance43776/ck5xkxk2b4j101imcyrkzrd0j"}
          ref={mapRef}
          height="100%"
          {...viewport}
          mapboxApiAccessToken={
            "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
          }
          onViewportChange={handleViewportChange}
          style={{
            width: "100%",
            minHeight: "calc(100% - 120px)",
            maxHeight: "calc(100%)",
            position: "relative"
          }}
        >
          {edit && page === "all reviews" ? (
            <Geocoder
              mapRef={mapRef}
              onResult={e => handleOnResult(e)}
              onViewportChange={handleViewportChange}
              limit={10}
              types={"poi"}
              mapboxApiAccessToken={
                "pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
              }
              position="top-left"
              placeholder={"Type a shop/restaurant/place..."}
              bbox={bbox}
            />
          ) : null}
          {!loadingReviews
            ? localCityReviews.map((review, index) => {
                return (
                  <Marker
                    key={review.reviewPlaceId + index}
                    latitude={review.review_latitude}
                    longitude={review.review_longitude}
                    offsetLeft={-5}
                    offsetTop={-10}
                  >
                    <svg
                      key={"svg" + review.reviewPlaceId + index}
                      height={20}
                      width={20}
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        onMouseOver={() => handleCityTooltip(review)}
                        style={{
                          fill: determineColor(review.attraction_type),
                          opacity: "0.5"
                        }}
                        key={"circle" + review.reviewPlaceId + index}
                        cx="50"
                        cy="50"
                        r="50"
                      />
                      <circle
                        style={{ fill: determineColor(review.attraction_type) }}
                        key={"circle2" + review.reviewPlaceId + index}
                        cx="50"
                        cy="50"
                        r="20"
                      />
                    </svg>
                  </Marker>
                );
              })
            : null}
          {!loadingReviews
            ? friendReviews.map((review, index) => {
                return (
                  <Marker
                    key={review.reviewPlaceId + index}
                    latitude={review.review_latitude}
                    longitude={review.review_longitude}
                    offsetLeft={-5}
                    offsetTop={-10}
                  >
                    <svg
                      key={"svg" + review.reviewPlaceId + index}
                      height={20}
                      width={20}
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        onMouseOver={() => handleCityTooltip(review)}
                        style={{
                          fill: determineColor(review.attraction_type),
                          opacity: "0.5"
                        }}
                        key={"circle" + review.reviewPlaceId + index}
                        cx="50"
                        cy="50"
                        r="50"
                      />
                      <circle
                        style={{
                          fill: determineColor(review.attraction_type),
                        }}
                        key={"circle2" + review.reviewPlaceId + index}
                        cx="50"
                        cy="50"
                        r="20"
                      />
                    </svg>
                  </Marker>
                );
              })
            : null}
          {_renderPopup()}
        </MapGL>
      </div>
    </>
  );
}

PlanningMap.propTypes = {
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  friendReviews: PropTypes.array,
  localCityReviews: PropTypes.array,
  handleLocalCityReviews: PropTypes.func,
  edit: PropTypes.bool,
  page: PropTypes.string
};

export default React.memo(PlanningMap);
