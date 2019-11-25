import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import {
  UPDATE_VISITED_CITY_BASICS,
  UPDATE_VISITING_CITY_BASICS,
  UPDATE_LIVING_CITY_BASICS
} from "../../../../GraphQL";

function CityBasicsContainer({ city }) {
  const [loaded, handleLoaded] = useState(false);
  const [feedbackState, handleFeedbackClick] = useState(false);
  const [cityBasics, handleCityBasics] = useState({
    days: city.days,
    year: city.year,
    trip_purpose: city.trip_purpose,
    trip_company: city.trip_company
  });
  const [id] = useState(city.id);
  const [edit, handleEdit] = useState(false);

  function handleCityDays(days) {
    cityBasics.days = Number(days);
    handleCityBasics(cityBasics);
  }
  function handleCityYear(year) {
    cityBasics.year = Number(year);
    handleCityBasics(cityBasics);
  }
  function handleTripType(type) {
    cityBasics.trip_purpose = type;
    handleCityBasics(cityBasics);
  }
  function handleTripCompany(company) {
    cityBasics.trip_company = company;
    handleCityBasics(cityBasics);
  }

  useEffect(() => {
    handleLoaded(true);
  }, []);

  if (!loaded) return "Loading";
  return (
    <div className="city-basics-container">
      <form id="nl-form" className="nl-form">
        {city.timing === "live" ? "I have lived in " : "My trip(s) to "}
        {city.city}{" "}
        {city.timing === "future"
          ? "will total "
          : city.timing === "live"
          ? "for "
          : "have totaled "}
        approximately
        {edit ? (
          <input
            className="trip-duration"
            onChange={e => handleCityDays(e.target.value)}
            defaultValue={cityBasics.days === null ? 0 : cityBasics.days}
          ></input>
        ) : (
          <span className="trip-data-span">
            {cityBasics.days === null ? 0 : cityBasics.days}
          </span>
        )}
        days.
        <br />
        {city.timing === "future"
          ? "I plan to go in "
          : city.timing === "live"
          ? "I still live here in "
          : "The last time I went was in "}
        {edit ? (
          <select
            id="trip-entry-travel-year"
            defaultValue={cityBasics.year === null ? "blank" : cityBasics.year}
            placeholder="year"
            onChange={e => handleCityYear(e.target.value)}
            className="trip-entry-select"
          >
            <option key="blank"></option>
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
        ) : (
          <span className="trip-data-span">
            {cityBasics.year === null ? "blank" : cityBasics.year}
          </span>
        )}
        .<br />
        {city.timing !== "live"
          ? city.timing === "future"
            ? "These trips will mainly be for "
            : "These trips were mainly for "
          : null}
        {edit && city.timing !== "live" ? (
          <select
            id="trip-entry-travel-type"
            defaultValue={
              cityBasics.trip_purpose !== null
                ? cityBasics.trip_purpose
                : "blank"
            }
            onChange={e => handleTripType(e.target.value)}
            className="trip-entry-select"
          >
            <option value="blank"></option>
            <option value="vacation">vacation</option>
            <option value="work">work</option>
          </select>
        ) : city.timing !== "live" ? (
          <span className="trip-data-span">
            {cityBasics.trip_purpose === null
              ? "blank"
              : cityBasics.trip_purpose}
          </span>
        ) : null}
        {city.timing !== "live"
          ? city.timing === "future"
            ? " and for the majority of the trips I'll travel"
            : " and for the majority of the trips I traveled "
          : null}
        {edit && city.timing !== "live" ? (
          <select
            id="trip-entry-travel-company"
            onChange={e => handleTripCompany(e.target.value)}
            className="trip-entry-select"
            defaultValue={
              cityBasics.trip_company !== null
                ? cityBasics.trip_company
                : "blank"
            }
          >
            <option value="blank"></option>
            <option value="by myself">by myself</option>
            <option value="with family">with family</option>
            <option value="with friends">with friends</option>
            <option value="with strangers">with strangers</option>
            <option value="with family and pets">with family and pets</option>
          </select>
        ) : city.timing !== "live" ? (
          <>
            <br />
            <span className="trip-data-span">
              {cityBasics.trip_company === null
                ? "blank"
                : cityBasics.trip_company}
            </span>
          </>
        ) : null}
        {city.timing !== "live" ? "." : null}
        <div className="nl-overlay" />
      </form>
      <div className="review-edit-button-container">
        <Mutation
          mutation={
            city.timing === "past"
              ? UPDATE_VISITED_CITY_BASICS
              : city.timing === "future"
              ? UPDATE_VISITING_CITY_BASICS
              : UPDATE_LIVING_CITY_BASICS
          }
          variables={{ id, cityBasics }}
        >
          {mutation =>
            edit ? (
              <span className="large confirm button" onClick={mutation}>
                Update
              </span>
            ) : (
              <span className="large button" onClick={handleEdit}>
                Edit
              </span>
            )
          }
        </Mutation>
      </div>
    </div>
  );
}

CityBasicsContainer.propTypes = {
  edit: PropTypes.bool,
  city: PropTypes.object
};

export default CityBasicsContainer;
