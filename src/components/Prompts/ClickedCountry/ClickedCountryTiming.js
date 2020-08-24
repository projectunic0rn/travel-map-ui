import React, { useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import UserContext from "../../../utils/UserContext";

import DeleteCitiesPopup from "./DeleteCitiesPopup";
import TrashIcon from "../../../icons/TrashIcon";
import ArrowRightIcon from "../../../icons/ArrowRightIcon";

function ClickedCountryTiming(props) {
  const cityArray = React.useContext(UserContext).clickedCityArray;
  const user = React.useContext(UserContext);
  const [country] = useState(props.customProps.countryInfo.properties.name);
  const [deletePopup, handleDeletePopup] = useState(false);
  const [timingText] = useState(
    props.customProps.currentTiming === 0
      ? "past"
      : props.customProps.currentTiming === 1
      ? "future"
      : "lived in"
  );
  const [tense] = useState(
    props.customProps.currentTiming === 0
      ? "have visited"
      : props.customProps.currentTiming === 1
      ? "will visit"
      : "live in"
  );
  function handleDeleteButton() {
    let popupText =
      "Do you want to delete all " +
      timingText +
      " cities associated with " +
      props.customProps.countryInfo.properties.name +
      "?";
    Swal.fire({
      type: "question",
      customClass: {
        container: "live-swal-prompt",
      },
      text: popupText,
      showCancelButton: true,
      cancelButtonColor: "#cb7678",
    }).then((result) => {
      if (result.value) {
        handleDeletePopup(true);
      }
    });
  }
  function handleDeleteCities() {
    let userData = { ...user };
    let newClickedCityArray = [];
    for (let i in userData.clickedCityArray) {
      if (
        userData.clickedCityArray[i].country !== country ||
        userData.clickedCityArray[i].tripTiming !==
          props.customProps.currentTiming
      ) {
        newClickedCityArray.push(userData.clickedCityArray[i]);
      }
    }
    userData.clickedCityArray = newClickedCityArray;
    user.handleClickedCityArray(userData.clickedCityArray);
    handleDeletePopup(false);
  }
  return (
    <div className="clicked-country-timing-container">
      <span>
        You have previously indicated that you {tense}{" "}
        {props.customProps.countryInfo.properties.name}
      </span>
      <span>Do you wish to delete the country and all city data?</span>
      <div className="previous-trips-button" onClick={handleDeleteButton}>
        <div className="trash-icon-container">
          <TrashIcon />
        </div>
        <div>delete cities</div>
      </div>
      <div
        className="cancel-delete-button"
        onClick={() => props.customProps.showPopup(false)}
      >
        <div className="back-icon-container">
          <ArrowRightIcon />
        </div>
        <div>cancel</div>
      </div>
      {deletePopup ? (
        <DeleteCitiesPopup
          country={country}
          handleDeleteCities={handleDeleteCities}
          currentTiming={props.customProps.currentTiming}
        />
      ) : null}
    </div>
  );
}

ClickedCountryTiming.propTypes = {
  customProps: PropTypes.object,
};

export default ClickedCountryTiming;
