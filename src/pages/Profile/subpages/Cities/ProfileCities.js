import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import MenuIcon from "../../../../icons/MenuIcon";
import AllTimingsIcon from "../../../../icons/AllTimingsIcon";
import PastIcon from "../../../../icons/PastIcon";
import FutureIcon from "../../../../icons/FutureIcon";
import LiveIcon from "../../../../icons/LiveIcon";
import ProfileCityCard from "./ProfileCityCard";

export default function ProfileCities({ searchText, handleSelectedCity }) {
  let fakeresults = [
    {
      city: "Barcelona",
      country: "Spain",
      timing: "past",
      stats: {
        days: 4,
        places: 3,
        meals: 2,
        logistics: 1
      }
    },
    {
      city: "Florence",
      country: "Italy",
      timing: "future",
      stats: {
        days: 3,
        places: 5,
        meals: 4,
        logistics: 3
      }
    },
    {
      city: "San Diego",
      country: "United States",
      timing: "live",
      stats: {
        days: 1230,
        places: 32,
        meals: 14,
        logistics: 4
      }
    }
  ];
  const [expanded, handleToggle] = useState(false);
  const [results, setResults] = useState(fakeresults);
  const [timing, handleTiming] = useState("");
  useEffect(() => {
    let filteredArray = fakeresults.filter(
      city =>
        (city.city.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
          city.country.toLowerCase().indexOf(searchText.toLowerCase()) > -1) &&
          city.timing.indexOf(timing) > -1
    );
    setResults(filteredArray);
  }, [searchText, timing]);

  function handleCityClick(city) {
      handleSelectedCity(city);
  }
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
          className={!timing ? "active" : ""}
        >
          {expanded ? "all" : null}
          <AllTimingsIcon />
        </button>
        <button
          onClick={() => handleTiming("past")}
          className={timing === "past" ? "active" : ""}
        >
          {expanded ? "past" : null}
          <PastIcon />
        </button>
        <button
          onClick={() => handleTiming("future")}
          className={timing === "future" ? "active" : ""}
        >
          {expanded ? "future" : null}
          <FutureIcon />
        </button>
        <button
          onClick={() => handleTiming("live")}
          className={timing === "live" ? "active" : ""}
        >
          {expanded ? "live" : null}
          <LiveIcon />
        </button>
      </div>
      <div className="content-results">
        {results.map(city => (
          <ProfileCityCard
            key={city.id}
            cityData={city}
            color={
              city.timing === "past"
                ? "#CB7678"
                : city.timing === "future"
                ? "#73A7C3"
                : "#96B1A8"
            }
            handleSelectedCity={handleCityClick}
          />
        ))}
      </div>
    </div>
  );
}

ProfileCities.propTypes = {
  searchText: PropTypes.string,
  handleSelectedCity: PropTypes.func
};
