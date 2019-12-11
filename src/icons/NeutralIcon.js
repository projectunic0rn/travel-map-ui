import React from "react";
import PropTypes from "prop-types";

function NeutralIcon({ value, onClick }) {

  return (
    <svg
      className={
        value
        ? "neutral-active feedback-icon neutral-icon"
        : "feedback-icon neutral-icon"
      }
      onClick={onClick}
      viewBox="0 0 20 20"
    >
        <path d="M14.776,10c0,0.239-0.195,0.434-0.435,0.434H5.658c-0.239,0-0.434-0.195-0.434-0.434s0.195-0.434,0.434-0.434h8.684C14.581,9.566,14.776,9.762,14.776,10 M18.25,10c0,4.558-3.693,8.25-8.25,8.25c-4.557,0-8.25-3.691-8.25-8.25c0-4.557,3.693-8.25,8.25-8.25C14.557,1.75,18.25,5.443,18.25,10 M17.382,10c0-4.071-3.312-7.381-7.382-7.381C5.929,2.619,2.619,5.93,2.619,10c0,4.07,3.311,7.382,7.381,7.382C14.07,17.383,17.382,14.07,17.382,10" />
    </svg>
  );
}

NeutralIcon.propTypes = {
  onClick: PropTypes.func,
  value: PropTypes.bool
};

export default NeutralIcon;
