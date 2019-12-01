import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import {
  UPDATE_VISITED_CITY_REVIEWS,
  UPDATE_VISITING_CITY_REVIEWS,
  UPDATE_LIVING_CITY_REVIEWS
} from "../../../../GraphQL";

import TransportationIconContainer from "./TransportationIconContainer";
import CarIcon from "../../../../icons/TransportationIcons/CarIcon";
import MotorbikeIcon from "../../../../icons/TransportationIcons/MotorbikeIcon";
import TrainIcon from "../../../../icons/TransportationIcons/TrainIcon";
import BoatIcon from "../../../../icons/TransportationIcons/BoatIcon";
import CruiseIcon from "../../../../icons/TransportationIcons/CruiseIcon";
import BusIcon from "../../../../icons/TransportationIcons/BusIcon";
import SubwayIcon from "../../../../icons/TransportationIcons/SubwayIcon";
import TaxiIcon from "../../../../icons/TransportationIcons/TaxiIcon";
import AirplaneIcon from "../../../../icons/TransportationIcons/AirplaneIcon";
import HelicopterIcon from "../../../../icons/TransportationIcons/HelicopterIcon";
import BikeIcon from "../../../../icons/TransportationIcons/BikeIcon";
import WalkIcon from "../../../../icons/TransportationIcons/WalkIcon";

function LogisticsInputContainer({ reviews, city, urlUsername }) {
  const [loaded, handleLoaded] = useState(false);
  const [edit, handleEdit] = useState(false);
  const [feedbackState, handleFeedbackClick] = useState(
    urlUsername !== undefined ? true : false
  );
  const [activeTransportComponents, handleActiveTransportComponents] = useState(
    []
  );
  const [localCityReviews, handleLocalCityReviews] = useState();
  const transportTypes = [
    "walk",
    "car",
    "taxi",
    "bus",
    "motorbike",
    "bike",
    "train",
    "subway",
    "airplane",
    "helicopter",
    "boat",
    "cruise"
  ];
  const transportComponents = [
    <WalkIcon key="walk" />,
    <CarIcon key="car" />,
    <TaxiIcon key="taxi" />,
    <BusIcon key="bus" />,
    <MotorbikeIcon key="motorbike" />,
    <BikeIcon key="bike" />,
    <TrainIcon key="train" />,
    <SubwayIcon key="subway" />,
    <AirplaneIcon key="airplane" />,
    <HelicopterIcon key="helicopter" />,
    <BoatIcon key="boat" />,
    <CruiseIcon key="cruise" />
  ];
  useEffect(() => {
    let activeTransport = [...activeTransportComponents];
    for (let i in reviews) {
      delete reviews[i].__typename;
      if (
        reviews[i].attraction_type === "logistics" &&
        activeTransport.indexOf(reviews[i].attraction_name) === -1
      ) {
        activeTransport.push(reviews[i].attraction_name);
      }
    }
    if (activeTransport.length > 0) {
      handleActiveTransportComponents(activeTransport);
    }
    handleLocalCityReviews(reviews);
    handleLoaded(true);
  }, [reviews]);
  function handleClickActive(index) {
    let activeComponents = [...activeTransportComponents];
    if (activeTransportComponents.indexOf(transportTypes[index]) === -1) {
      activeComponents.push(transportTypes[index]);
      let newCityReview = {
        id: 0,
        attraction_type: "logistics",
        attraction_name: transportTypes[index],
        rating: 1,
        cost: null,
        currency: "USD",
        comment: ""
      };
      city.timing === "past"
        ? (newCityReview.PlaceVisitedId = city.id)
        : city.timing === "future"
        ? (newCityReview.PlaceVisitingId = city.id)
        : (newCityReview.PlaceLivingId = city.id);
      localCityReviews.push(newCityReview);
    } else {
      activeComponents.splice(activeComponents.indexOf(index), 1);
      let deleteIndex = localCityReviews.findIndex(
        review => review.attraction_name === transportTypes[index]
      );
      localCityReviews.splice(deleteIndex, 1);
    }
    handleActiveTransportComponents(activeComponents);
    handleLocalCityReviews(localCityReviews);
  }
  function handleRatingChange(id, rating) {
    let reviewToUpdate = localCityReviews.findIndex(review => review.id === id);
    localCityReviews[reviewToUpdate].rating = rating;
    handleLocalCityReviews(localCityReviews);
  }
  function handleCostChange(id, cost) {
    let reviewToUpdate = localCityReviews.findIndex(review => review.id === id);
    if (cost === null || cost === "") {
      localCityReviews[reviewToUpdate].cost = null;
    } else {
      localCityReviews[reviewToUpdate].cost = Number(cost);
    }
    handleLocalCityReviews(localCityReviews);
  }
  function handleCurrencyChange(id, currency) {
    let reviewToUpdate = localCityReviews.findIndex(review => review.id === id);
    localCityReviews[reviewToUpdate].currency = currency;
    handleLocalCityReviews(localCityReviews);
  }
  function handleCommentChange(id, comment) {
    let reviewToUpdate = localCityReviews.findIndex(review => review.id === id);
    localCityReviews[reviewToUpdate].comment = comment;
    handleLocalCityReviews(localCityReviews);
  }
  if (!loaded) return "Loading";
  return (
    <div
      className={
        !feedbackState
          ? "transportation-container"
          : "transportation-feedback-container"
      }
    >
      {!feedbackState ? (
        <>
          {transportTypes.map((transportationType, index) => {
            return (
              <TransportationIconContainer
                key={transportationType}
                edit={edit}
                tagName={transportationType}
                component={transportComponents[index]}
                feedback={feedbackState}
                index={index}
                handleClickActive={handleClickActive}
                active={
                  activeTransportComponents.indexOf(transportationType) !== -1
                }
                review={
                  activeTransportComponents.indexOf(transportationType) !== -1
                    ? reviews.find(
                        element =>
                          element.attraction_name === transportationType
                      )
                    : null
                }
              />
            );
          })}
          {edit ? (
            <div className="transportation-submitted-container">
              <button
                className="confirm button"
                onClick={() => handleFeedbackClick(true)}
              >
                Give feedback
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <>
          {transportTypes.map((transportationType, index) => {
            if (
              activeTransportComponents.indexOf(transportTypes[index]) !== -1
            ) {
              return (
                <TransportationIconContainer
                  edit={edit}
                  key={transportationType}
                  tagName={transportationType}
                  component={transportComponents[index]}
                  feedbackState={feedbackState}
                  index={index}
                  handleClickActive={handleClickActive}
                  handleRatingChange={handleRatingChange}
                  handleCostChange={handleCostChange}
                  handleCurrencyChange={handleCurrencyChange}
                  handleCommentChange={handleCommentChange}
                  review={
                    activeTransportComponents.indexOf(transportationType) !== -1
                      ? reviews.find(
                          element =>
                            element.attraction_name === transportationType
                        )
                      : null
                  }
                />
              );
            }
          })}
          {activeTransportComponents.length < 1 ? (
            <div className="no-review-text">
              No transportation methods entered yet
            </div>
          ) : null}
          <div className="transportation-submitted-container">
            <button
              className="confirm button"
              onClick={() => handleFeedbackClick(false)}
            >
              Back
            </button>
          </div>
        </>
      )}
      {urlUsername !== undefined ? null : (
        <div className="review-edit-button-container">
          <Mutation
            mutation={
              city.timing === "past"
                ? UPDATE_VISITED_CITY_REVIEWS
                : city.timing === "future"
                ? UPDATE_VISITING_CITY_REVIEWS
                : UPDATE_LIVING_CITY_REVIEWS
            }
            variables={{ localCityReviews }}
          >
            {mutation =>
              edit ? (
                <span className="large confirm button" onClick={mutation}>
                  Update
                </span>
              ) : (
                <span className="large button" onClick={() => handleEdit(true)}>
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

LogisticsInputContainer.propTypes = {
  reviews: PropTypes.array,
  city: PropTypes.object,
  urlUsername: PropTypes.string
};

export default LogisticsInputContainer;
