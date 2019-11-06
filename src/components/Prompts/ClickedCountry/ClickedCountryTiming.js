import React, { useState } from "react";
import PropTypes from "prop-types";

import Swal from "sweetalert2";
import DeleteCitiesPopup from "./DeleteCitiesPopup";
import TrashIcon from '../../../icons/TrashIcon';

function ClickedCountryTiming(props) {
  const [countryISO] = useState(props.country);
  const [deletePopup, handleDeletePopup] = useState(false);
  function handleAddCountryTiming(timing) {
    props.handleTripTiming(timing);
    props.handlePageChange(1);
  }
  function handleDeleteButton() {
    let popupText =
      "Do you want to delete all cities associated with " + props.countryName + "?";
    const swalParams = {
      type: "question",
      customClass: {
        container: "live-swal-prompt"
      },
      text: popupText
    };
    Swal.fire(swalParams).then(result => {
      if (result.value) {
        handleDeletePopup(true);
      }
    });
  }
  function handleDeleteCities() {
    handleDeletePopup(false);
    props.handleDelete();
  }
  return (
    <div className="clicked-country-timing-container">
      <span onClick={() => handleAddCountryTiming(0)}>I visited here</span>
      <span onClick={() => handleAddCountryTiming(1)}>
        I plan to visit here
      </span>
      <span onClick={() => handleAddCountryTiming(2)}>
        I live here currently
      </span>
      {props.previousTrips ? (
        <div className="previous-trips-button" onClick={handleDeleteButton}>
         <div className = 'trash-icon-container'><TrashIcon /></div><div>delete cities</div>
        </div>
      ) : null}
      {deletePopup ? (
        <DeleteCitiesPopup
          countryISO={countryISO}
          handleDeleteCities={handleDeleteCities}
        />
      ) : null}
    </div>
  );
}

ClickedCountryTiming.propTypes = {
  handleTripTiming: PropTypes.func,
  handlePageChange: PropTypes.func,
  handleDelete: PropTypes.func,
  previousTrips: PropTypes.bool,
  country: PropTypes.string,
  countryName: PropTypes.string
};

export default ClickedCountryTiming;
