import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import MenuIcon from "../../../../icons/MenuIcon";
import CityReviewCard from "./CityReviewCard";
import CalendarIcon from "../../../../icons/CalendarIcon";
import LocationIcon from "../../../../icons/LocationIcon";
import FoodieIcon from "../../../../icons/InterestIcons/FoodieIcon";
import LogisticsIcon from "../../../../icons/LogisticsIcon";

export default function ProfileIndividualCity({ searchText, city }) {
  let fakeresults = [
    {
      attraction_type: "place",
      attraction_name: "Duomo",
      rating: 2,
      cost: 0,
      currency: "Euro",
      comment: "Great place to visit!"
    },
    {
      attraction_type: "dinner",
      attraction_name: "Del Favioli",
      rating: 2,
      cost: 20,
      currency: "Euro",
      comment: "Great place to eat!"
    }
  ];
  const [expanded, handleToggle] = useState(false);
  const [results, setResults] = useState(fakeresults);
  const [timing, handleTiming] = useState("");
 

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
          {expanded ? "days" : null}
          <CalendarIcon />
        </button>
        <button
          onClick={() => handleTiming("past")}
          className={timing === "past" ? "active" : ""}
        >
          {expanded ? "places" : null}
          <LocationIcon />
        </button>
        <button
          onClick={() => handleTiming("future")}
          className={timing === "future" ? "active" : ""}
        >
          {expanded ? "meals" : null}
          <FoodieIcon />
        </button>
        <button
          onClick={() => handleTiming("live")}
          className={timing === "live" ? "active" : ""}
        >
          {expanded ? "logistics" : null}
          <LogisticsIcon />
        </button>
      </div>
      <div className="content-results">
        {fakeresults.map(review => (
          <CityReviewCard review={review} />
        ))}
      </div>
    </div>
  );
}

ProfileIndividualCity.propTypes = {
  searchText: PropTypes.string,
  city: PropTypes.string
};
