import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import MenuIcon from "../../../../icons/MenuIcon";
import CityReviewCard from "./CityReviewCard";
import CalendarIcon from "../../../../icons/CalendarIcon";
import LocationIcon from "../../../../icons/LocationIcon";
import FoodieIcon from "../../../../icons/InterestIcons/FoodieIcon";
import CommentaryIcon from "../../../../icons/CommentaryIcon";
import LogisticsIcon from "../../../../icons/LogisticsIcon";
import LogisticsInputContainer from "./LogisticsInputContainer";
import CityBasicsContainer from "./CityBasicsContainer";

export default function ProfileIndividualCity({ searchText, city }) {
  let fakeresults = {
    year: 2014,
    days: 10,
    trip_purpose: "work",
    trip_company: "family",
    CityReviews: [
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
      },
      {
        attraction_type: "logistics",
        attraction_name: "car",
        rating: 1,
        cost: 10,
        currency: "EUR",
        comment: "Easy place to drive"
      },
      {
        attraction_type: "logistics",
        attraction_name: "walk",
        rating: 1,
        cost: 0,
        currency: "EUR",
        comment: "Easy place to walk"
      }
    ]
  };
  const [expanded, handleToggle] = useState(false);
  const [results, setResults] = useState(fakeresults);
  const [page, handlePage] = useState("basics");
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
      case "logistics":
        keyWords = ["logistics"];
        break;
      default:
        break;
    }
    let filteredArray = fakeresults.CityReviews.filter(city => {
      for (let i in keyWords) {
        if (city.attraction_type === keyWords[i]) {
          return true;
        }
      }
      return false;
    });
    fakeresults.CityReviews = filteredArray;
    setResults(fakeresults);
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
          onClick={() => handlePage("basics")}
          className={page === "basics" ? "active" : ""}
        >
          {expanded ? "basics" : null}
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
        <div className="city-review-header">
          <span className="city-review-page">{page}</span>
          <div className="city-review-place">
            <span className="city-review-title">{city.city.toLowerCase()}</span>
            <span className="city-review-subtitle">
              <span className="city-review-separator">|</span>{" "}
              {city.country.toLowerCase()}
            </span>
          </div>
        </div>

        {
          {
            basics: (
              <CityBasicsContainer
                key={"basics"}
                city={city.city}
                edit={edit}
                results={results}
              />
            ),
            logistics: (
              <LogisticsInputContainer
                key={"logistics"}
                review={results.CityReviews}
                edit={edit}
              />
            ),
            places: results.CityReviews.map((review, index) => (
              <CityReviewCard
                key={review.attraction_type + index}
                review={review}
                edit={edit}
              />
            )),
            meals: results.CityReviews.map((review, index) => (
              <CityReviewCard
                key={review.attraction_type + index}
                review={review}
                edit={edit}
              />
            ))
          }[page]
        }
        <div className="review-edit-button-container">
          {edit ? (
            <span className="large button" onClick={() => handleEdit(false)}>
              Update
            </span>
          ) : (
            <span className="large button" onClick={() => handleEdit(true)}>
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
