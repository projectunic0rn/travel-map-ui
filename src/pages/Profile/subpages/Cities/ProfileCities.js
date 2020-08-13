import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import UserContext from "../../../../utils/UserContext";

import MenuIcon from "../../../../icons/MenuIcon";
import AllTimingsIcon from "../../../../icons/AllTimingsIcon";
import PastIcon from "../../../../icons/PastIcon";
import FutureIcon from "../../../../icons/FutureIcon";
import LiveIcon from "../../../../icons/LiveIcon";
import ProfileCityCard from "./ProfileCityCard";
import Loader from "../../../../components/common/Loader/Loader";

export default function ProfileCities({
  searchText,
  handleSelectedCity,
  urlUsername
}) {
  const cityData = React.useContext(UserContext).clickedCityArray;
  const [loaded, handleLoaded] = useState(false);
  const [expanded, handleToggle] = useState(false);
  const [results, setResults] = useState();
  const [timing, handleTiming] = useState("");
  useEffect(() => {
    let filteredArray = [];
    if (cityData !== undefined) {
      if (timing === "") {
        filteredArray = cityData.filter(
          (city) =>
            city.city.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
            city.country.toLowerCase().indexOf(searchText.toLowerCase()) > -1
        );
      } else {
        filteredArray = cityData.filter(
          (city) =>
            (city.city.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
            city.country.toLowerCase().indexOf(searchText.toLowerCase()) > -1) && city.tripTiming === timing
        );
      }
      setResults(filteredArray);
      handleLoaded(true);
    }
  }, [searchText, timing, cityData]);

  if (!loaded) return <Loader />;
  return (
    <div className="profile-cities content">
      <div
        className={
          expanded ? "sidebar-filter sidebar-filter-active" : "sidebar-filter"
        }
      >
        <a onClick={() => handleToggle(!expanded)}>
          {expanded ? <div></div> : null}
          <MenuIcon />
        </a>
        <button
          onClick={() => handleTiming("")}
          className={timing === "" ? "active" : ""}
        >
          {expanded ? "all" : null}
          <AllTimingsIcon />
        </button>
        <button
          onClick={() => handleTiming(0)}
          className={timing === 0 ? "active" : ""}
        >
          {expanded ? "past" : null}
          <PastIcon />
        </button>
        <button
          onClick={() => handleTiming(1)}
          className={timing === 1 ? "active" : ""}
        >
          {expanded ? "future" : null}
          <FutureIcon />
        </button>
        <button
          onClick={() => handleTiming(2)}
          className={timing === 2 ? "active" : ""}
        >
          {expanded ? "live" : null}
          <LiveIcon />
        </button>
      </div>
      <div className="content-results">
        {results.length < 1 ? (
          <span className="no-cities-text">No cities recorded yet!</span>
        ) : null}
        {results.map((city, index) => (
          <ProfileCityCard
            key={city.city + city.tripTiming + index}
            urlUsername={urlUsername}
            cityData={city}
            color={
              city.tripTiming === 0
                ? "#CB7678"
                : city.tripTiming === 1
                ? "#73A7C3"
                : "#96B1A8"
            }
            handleSelectedCity={handleSelectedCity}
          />
        ))}
      </div>
    </div>
  );
}

ProfileCities.propTypes = {
  searchText: PropTypes.string,
  handleSelectedCity: PropTypes.func,
  user: PropTypes.object,
  cityData: PropTypes.object,
  urlUsername: PropTypes.string,
  location: PropTypes.object,
  handleOriginalSearch: PropTypes.func,
};
