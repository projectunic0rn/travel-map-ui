import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import {
  UPDATE_VISITED_CITY_BASICS,
  UPDATE_VISITING_CITY_BASICS,
  UPDATE_LIVING_CITY_BASICS
} from "../../../../GraphQL";
import { TripDetailContext } from "./TripDetailsContext";

function TripBasicsContainer({ trip, refetch, urlUsername }) {
  const [loaded, handleLoaded] = useState(false);
  const [cityBasics, handleCityBasics] = useState();
  const [tripDuration, handleTripDuration] = useState(null);
  //   const [id] = useState(trip.id);
  const [edit, handleEdit] = useState(true);
  const {
    tripName,
    tripTiming,
    tripStartDate,
    tripEndDate,
    tripType,
    tripCompany,
    updateTripName,
    updateTripStartDate,
    updateTripEndDate,
    updateTripType,
    updateTripCompany
  } = useContext(TripDetailContext);
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
    if (tripStartDate !== null && tripEndDate !== null) {
      let timeDiff = new Date(tripEndDate) - new Date(tripStartDate);
      let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24) + 0.00001);
      handleTripDuration(diffDays);
    }
  }, []);

  useEffect(() => {
    handleLoaded(true);
  }, []);

  function handleStartDate(e) {
    let startDate = new Date(e.target.value).toISOString().slice(0, 10);

    if (startDate !== null && tripEndDate !== null) {
      let timeDiff = new Date(tripEndDate) - new Date(startDate);
      let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24) + 0.00001);

      handleTripDuration(diffDays);
    }
    updateTripStartDate(startDate);
  }

  function handleEndDate(e) {
    let endDate = new Date(e.target.value).toISOString().slice(0, 10);

    if (endDate !== null && tripStartDate !== null) {
      let timeDiff = new Date(endDate) - new Date(tripStartDate);
      let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24) + 0.00001);

      handleTripDuration(diffDays);
    }
    updateTripEndDate(endDate);
  }

  if (!loaded) return "Loading";
  return (
    <div className="city-basics-container" id="trip-basics-container">
      <div className="trip-dates-container">
        <span>
          <span className="trip-dates-title">Start Date</span>
          <input
            id="trip-entry-date"
            onChange={handleStartDate}
            type="date"
            className="trip-entry-input"
            defaultValue={tripStartDate}
          />
        </span>
        <span>
          <span className="trip-dates-title">End Date</span>
          <input
            id="trip-entry-date"
            onChange={handleEndDate}
            type="date"
            className="trip-entry-input"
            defaultValue={tripEndDate}
          />
        </span>
      </div>
      <form id="nl-form" className="nl-form">
        This trip will total{" "}
        <span className="trip-duration">
          {tripDuration !== null ? tripDuration : "XX"}
        </span>{" "}
        days.
        <br />
        {tripTiming === "future"
          ? "These trips will mainly be for "
          : "These trips were mainly for "}
        {edit ? (
          <select
            id="trip-entry-travel-type"
            defaultValue={tripType !== null ? tripType : "blank"}
            onChange={e => updateTripType(e.target.value)}
            className="trip-entry-select"
          >
            <option value="blank"></option>
            <option value="vacation">vacation</option>
            <option value="work">work</option>
          </select>
        ) : tripTiming !== "live" ? (
          <span className="trip-data-span">
            {tripType === null ? "blank" : tripType}
          </span>
        ) : null}
        <br />
        {tripTiming === "future"
          ? "For the majority of the trips I'll travel"
          : "For the majority of the trips I traveled "}
        {edit ? (
          <select
            id="trip-entry-travel-company"
            onChange={e => updateTripCompany(e.target.value)}
            className="trip-entry-select"
            defaultValue={tripCompany !== null ? tripCompany : "blank"}
          >
            <option value="blank"></option>
            <option value="by myself">by myself</option>
            <option value="with family">with family</option>
            <option value="with friends">with friends</option>
            <option value="with strangers">with strangers</option>
            <option value="with family and pets">with family and pets</option>
          </select>
        ) : tripTiming !== "live" ? (
          <>
            <br />
            <span className="trip-data-span">
              {cityBasics.trip_company === null
                ? "blank"
                : cityBasics.trip_company}
            </span>
          </>
        ) : null}
        {tripTiming !== "live" ? "." : null}
        <div className="nl-overlay" />
      </form>
      {urlUsername !== undefined ? null : (
        <div className="review-edit-button-container">
          <Mutation
            mutation={
              tripTiming === "past"
                ? UPDATE_VISITED_CITY_BASICS
                : tripTiming === "future"
                ? UPDATE_VISITING_CITY_BASICS
                : UPDATE_LIVING_CITY_BASICS
            }
            // variables={{ id, cityBasics }}
            onCompleted={() => refetch()}
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
      )}
    </div>
  );
}

TripBasicsContainer.propTypes = {
  trip: PropTypes.object,
  refetch: PropTypes.func,
  urlUsername: PropTypes.string
};

export default TripBasicsContainer;
