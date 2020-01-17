import React from "react";
import PropTypes from "prop-types";

function CostIcon({ value, onClick }) {
  return (
    <div>
      <svg
        className={
          value
            ? "cost-active feedback-icon cost-icon"
            : "feedback-icon cost-icon"
        }
        onClick={onClick}
        viewBox="0 0 72 72"
      >
        <circle className="cost-circle" cx="32" cy="32" r="28" fill="none" />
        <path
          className="cost-icon-symbol"
          fill="none"
          d="M16 30h20m-18 6h14m6-20h-2.1a16 16 0 0 0 0 32H38"
        />
      </svg>
    </div>
  );
}

CostIcon.propTypes = {
  value: PropTypes.number,
  onClick: PropTypes.func
};

export default CostIcon;
