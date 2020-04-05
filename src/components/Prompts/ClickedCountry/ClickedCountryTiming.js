import React, { useState } from "react";
import PropTypes from "prop-types";

import Swal from "sweetalert2";
import DeleteCitiesPopup from "./DeleteCitiesPopup";
import TrashIcon from "../../../icons/TrashIcon";
import ArrowRightIcon from "../../../icons/ArrowRightIcon";

function ClickedCountryTiming(props) {
  const [countryISO] = useState(props.customProps.countryInfo.properties.ISO2);
  const [deletePopup, handleDeletePopup] = useState(false);
  const [tense] = useState(
    props.customProps.currentTiming === "past"
      ? "have visited"
      : props.customProps.currentTiming === "future"
      ? "will visit"
      : "live in"
  );
  function handleDeleteButton() {
    let popupText =
      "Do you want to delete all " +
      props.customProps.currentTiming +
      " cities associated with " +
      props.customProps.countryInfo.properties.name +
      "?";
    Swal.fire({
      type: "question",
      customClass: {
        container: "live-swal-prompt"
      },
      text: popupText,
      showCancelButton: true,
      cancelButtonColor: "#cb7678"
    }).then(result => {
      if (result.value) {
        handleDeletePopup(true);
      }
    });
  }
  function handleDeleteCities() {
    handleDeletePopup(false);
    props.customProps.refetch();
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
          countryISO={countryISO}
          handleDeleteCities={handleDeleteCities}
          currentTiming={
            props.customProps.currentTiming === "past"
              ? Number(0)
              : (props.customProps.currentTiming === "future"
                  ? Number(1)
                  : Number(2))
          }
        />
      ) : null}
    </div>
  );
}

ClickedCountryTiming.propTypes = {
  customProps: PropTypes.array
};

export default ClickedCountryTiming;
