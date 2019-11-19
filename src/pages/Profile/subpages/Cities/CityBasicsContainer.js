import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function CityBasicsContainer({ results, edit, city }) {
  const [loaded, handleLoaded] = useState(false);
  const [feedbackState, handleFeedbackClick] = useState(false);
  const [cityDays, handleCityDays] = useState(results.days);
  const [cityYear, handleCityYear] = useState(results.year);
  const [tripType, handleTripType] = useState(results.trip_purpose);
  const [tripCompany, handleTripCompany] = useState(results.trip_company);

  useEffect(() => {
    handleLoaded(true);
  }, []);

  if (!loaded) return "Loading";
  return (
    <div className="city-basics-container">
      <form id="nl-form" className="nl-form">
        My trips to {city} have totaled approximately
        <input
          className="trip-duration"
          onChange={(e) => handleCityDays(e.target.value)}
          defaultValue={cityDays}
        ></input>
        days.
        <br />
        The last time I went was in
        <select
          id="trip-entry-travel-type"
          defaultValue={cityYear}
          placeHolder="year"
          onChange={(e) => handleCityYear(e.target.value)}
          className="trip-entry-select"
        >
          {Array.from(
            new Array(100),
            (val, index) => new Date().getFullYear() - index
          ).map((year, index) => {
            return (
              <option key={`year${index}`} value={year}>
                {year}
              </option>
            );
          })}
        </select>
        .<br />
        These trips were mainly for
        <select
          id="trip-entry-travel-type"
          defaultValue={tripType}
          onChange={(e) => handleTripType(e.target.value)}
          className="trip-entry-select"
        >
          <option value="vacation">vacation</option>
          <option value="work">work</option>
        </select>
        and for the majority of the trips I traveled
        <select
          id="trip-entry-travel-company"
          onChange={(e) => handleTripCompany(e.target.value)}
          className="trip-entry-select"
          defaultValue={tripCompany}
        >
          <option value="by myself">by myself</option>
          <option value="family">with family</option>
          <option value="friends">with friends</option>
          <option value="strangers">with strangers</option>
          <option value="family and pets">with family and pets</option>
        </select>
        .
        <div className="nl-overlay" />
      </form>
    </div>
  );
}

CityBasicsContainer.propTypes = {
  results: PropTypes.object,
  edit: PropTypes.bool,
  city: PropTypes.string
};

export default CityBasicsContainer;
