import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

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

function LogisticsInputContainer({ review, edit }) {
  const [loaded, handleLoaded] = useState(false);
  const [feedbackState, handleFeedbackClick] = useState(false);
  const [activeTransportComponents, handleActiveTransportComponents] = useState(
    []
  );
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
    <WalkIcon key = "walk" />,
    <CarIcon key = "car" />,
    <TaxiIcon key = "taxi" />,
    <BusIcon key = "bus" />,
    <MotorbikeIcon key = "motorbike" />,
    <BikeIcon key = "bike" />,
    <TrainIcon key = "train" />,
    <SubwayIcon key = "subway" />,
    <AirplaneIcon key = "airplane" />,
    <HelicopterIcon key = "helicopter" />,
    <BoatIcon key = "boat" />,
    <CruiseIcon key = "cruise" />
  ];
  useEffect(() => {
    let activeTransport = activeTransportComponents;
    for (let i in review) {
      if (review[i].attraction_type === "logistics") {
        activeTransport.push(review[i].attraction_name);
      }
    }
    if (activeTransport.length > 0) {
      handleActiveTransportComponents(activeTransport);
      handleLoaded(true);
    }
  }, [review]);
  function handleClickActive(index) {
    let activeComponents = activeTransportComponents;
    if (activeTransportComponents.indexOf(index) === -1) {
      activeComponents.push(transportTypes[index]);
    } else {
      activeComponents.splice(activeComponents.indexOf(index), 1);
    }
    handleActiveTransportComponents(activeComponents);
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
                tagName={transportationType}
                component={transportComponents[index]}
                feedback={feedbackState}
                index={index}
                handleClickActive={handleClickActive}
                active={
                  activeTransportComponents.indexOf(transportationType) !== -1
                }
              />
            );
          })}
          <div className="transportation-submitted-container">
            <button
              className="confirm button"
              onClick={() => handleFeedbackClick(true)}
            >
              Give feedback
            </button>
          </div>
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
                  review={activeTransportComponents.indexOf(transportationType) !== -1 ? review.find(element => element.attraction_name === transportationType) : null}
                />
              );
            }
          })}
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
    </div>
  );
}

LogisticsInputContainer.propTypes = {
  review: PropTypes.object, 
  edit: PropTypes.bool
}

export default LogisticsInputContainer;
