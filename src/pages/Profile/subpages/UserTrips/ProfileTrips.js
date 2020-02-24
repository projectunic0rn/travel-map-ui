import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

import MenuIcon from "../../../../icons/MenuIcon";
import AllTimingsIcon from "../../../../icons/AllTimingsIcon";
import PastIcon from "../../../../icons/PastIcon";
import FutureIcon from "../../../../icons/FutureIcon";
import LiveIcon from "../../../../icons/LiveIcon";
import TripCard from "./TripCard";
import Loader from "../../../../components/common/Loader/Loader";

const fakeTrips = [
  {
    id: 1,
    tripName: "Italy 2018",
    days: 8,
    timing: "past",
    season: "Q3",
    year: 2018,
    cities: 8,
    countries: 2
  },
  {
    id: 2,
    tripName: "Italy 2015",
    days: 10,
    timing: "past",
    season: "Q4",
    year: 2015,
    cities: 7,
    countries: 2
  },
  {
    id: 3,
    tripName: "Hawaii Vacation",
    days: 5,
    timing: "future",
    season: "Q2",
    year: 2020,
    cities: 4,
    countries: 1
  }
];

export default function ProfileTrips({
  searchText,
  handleSelectedCity,
  cityData,
  urlUsername,
  location,
  handleOriginalSearch,
  refetch
}) {
  const [loaded, handleLoaded] = useState(false);
  const [expanded, handleToggle] = useState(false);
  const [results, setResults] = useState();
  const [timing, handleTiming] = useState("");
  useEffect(() => {
    if (location.state !== null) {
      handleOriginalSearch(location.state.searchText);
    } else {
      handleOriginalSearch("");
    }
  }, [location, handleOriginalSearch]);
  useEffect(() => {
    let combinedResults = [];
    for (let i in cityData.Places_visited) {
      if (cityData.Places_visited[i].city !== "") {
        cityData.Places_visited[i].timing = "past";
        combinedResults.push(cityData.Places_visited[i]);
      }
    }
    for (let i in cityData.Places_visiting) {
      if (cityData.Places_visiting[i].city !== "") {
        cityData.Places_visiting[i].timing = "future";
        combinedResults.push(cityData.Places_visiting[i]);
      }
    }
    if (cityData.Place_living !== null && cityData.Place_living.city !== "") {
      cityData.Place_living.timing = "live";
      combinedResults.push(cityData.Place_living);
    }
    setResults(combinedResults);
    let filteredArray = combinedResults.filter(
      city =>
        (city.city.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
          city.country.toLowerCase().indexOf(searchText.toLowerCase()) > -1) &&
        city.timing.indexOf(timing) > -1
    );
    setResults(filteredArray);
    handleLoaded(true);
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
        {results.length < 1 ? (
          <span className="no-cities-text">No cities recorded yet!</span>
        ) : null}
        <NavLink to={`/profile/trips/new/past`}>
          <div className="add-trip-container">
            <span id = "atc-past">+</span>
            <svg
              className="circle-icon atc-past-circle"
              xmlns="http://www.w3.org/2000/svg"
              id="Layer_1"
              viewBox="0 0 60 60"
            >
              <circle opacity="0.25" cx="30" cy="30" r="30" />
              <circle cx="30" cy="30.001" r="15" />
            </svg>
          </div>
        </NavLink>{" "}
        <NavLink to={`/profile/trips/new/future`}>
          <div className="add-trip-container">
            <span id="atc-future">+</span>
            <svg
              className="circle-icon atc-future-circle"
              xmlns="http://www.w3.org/2000/svg"
              id="Layer_1"
              viewBox="0 0 60 60"
            >
              <circle opacity="0.25" cx="30" cy="30" r="30" />
              <circle cx="30" cy="30.001" r="15" />
            </svg>
          </div>
        </NavLink>
        {fakeTrips.map((trip, index) => (
          <TripCard
            key={trip.tripName + trip.year + index}
            urlUsername={urlUsername}
            tripData={trip}
            refetch={refetch}
            color={
              trip.timing === "past"
                ? "#CB7678"
                : trip.timing === "future"
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

ProfileTrips.propTypes = {
  searchText: PropTypes.string,
  handleSelectedCity: PropTypes.func,
  user: PropTypes.object,
  cityData: PropTypes.object,
  urlUsername: PropTypes.string,
  location: PropTypes.object,
  handleOriginalSearch: PropTypes.func,
  refetch: PropTypes.func
};
