import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import MenuIcon from "../../../../icons/MenuIcon";
import CityReviewCard from "./CityReviewCard";
import CalendarIcon from "../../../../icons/CalendarIcon";
import LocationIcon from "../../../../icons/LocationIcon";
import FoodieIcon from "../../../../icons/InterestIcons/FoodieIcon";
import CommentaryIcon from "../../../../icons/CommentaryIcon";
import LogisticsIcon from "../../../../icons/LogisticsIcon";

export default function ProfileIndividualCity({ searchText, city }) {
  let fakeresults = [
    {
      attraction_type: "place",
      attraction_name: "Duomo",
      rating: 2,
      cost: 0,
      currency: "EUR",
      comment: "Great place to visit!"
    },
    {
      attraction_type: "dinner",
      attraction_name: "Del Favioli",
      rating: 2,
      cost: 20,
      currency: "EUR",
      comment: "Great place to eat!"
    },
    {
      attraction_type: "breakfast",
      attraction_name: "La Pasticceria",
      rating: 1,
      cost: 14,
      currency: "USD",
      comment: "Good pastries"
    },
    {
      attraction_type: "monument",
      attraction_name: "Bridge",
      rating: 1,
      cost: 0,
      currency: "EUR",
      comment: "Great place to eat!"
    }
  ];
  const [expanded, handleToggle] = useState(false);
  const [results, setResults] = useState(fakeresults);
  const [page, handlePage] = useState("places");
  const [edit, handleEdit] = useState(false);
  useEffect(() => {
    let keyWords = [];
    switch (page) {
      case "places":
        keyWords = ["monument", "nature", "place", "stay"];
        break;
      case "meals":
        keyWords = ["breakfast", "lunch", "dinner", "snack", "drink"];
        break;
      default:
        break;
    }
    let filteredArray = fakeresults.filter(city => {
      for (let i in keyWords) {
        if (city.attraction_type === keyWords[i]) {
          return true;
        }
      }
      return false;
    });
    setResults(filteredArray);
  }, [page]);

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
          onClick={() => handlePage("days")}
          className={page === "days" ? "active" : ""}
        >
          {expanded ? "days" : null}
          <CalendarIcon />
        </button>
        <button
          onClick={() => handlePage("places")}
          className={page === "places" ? "active" : ""}
        >
          {expanded ? "places" : null}
          <LocationIcon />
        </button>
        <button
          onClick={() => handlePage("meals")}
          className={page === "meals" ? "active" : ""}
        >
          {expanded ? "meals" : null}
          <FoodieIcon />
        </button>
        <button
          onClick={() => handlePage("logistics")}
          className={page === "logistics" ? "active" : ""}
        >
          {expanded ? "logistics" : null}
          <LogisticsIcon />
        </button>
        <button
          onClick={() => handlePage("comments")}
          className={page === "comments" ? "active" : ""}
        >
          {expanded ? "comments" : null}
          <CommentaryIcon />
        </button>
      </div>
      <div className="content-results">
        <span className="city-review-title">{city.city.toLowerCase()}</span>
        <span className="city-review-subtitle">{city.country.toLowerCase()}</span>
        {results.map((review, index) => (
          <CityReviewCard
            key={review.attraction_type + index}
            review={review}
            edit={edit}
          />
        ))}
        <div className="review-edit-button-container">
          {edit ? (
            <span
              className="review-edit-button"
              onClick={() => handleEdit(false)}
            >
              Update
            </span>
          ) : (
            <span
              className="review-edit-button"
              onClick={() => handleEdit(true)}
            >
              Edit
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

ProfileIndividualCity.propTypes = {
  searchText: PropTypes.string,
  city: PropTypes.string
};
