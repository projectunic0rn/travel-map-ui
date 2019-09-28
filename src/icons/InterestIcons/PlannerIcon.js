import React from "react";
import PropTypes from "prop-types";

function PlannerIcon({ color }) {
  return (
    <svg
      className="interest-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 19 16"
      width="19"
      height="16"
    >
      <path
        fill={color}
        id="ic_format_list_numbered_24px"
        transform="translate(-2 -4)"
        d="M 2 17 H 4 v 0.5 H 3 v 1 H 4 V 19 H 2 v 1 H 5 V 16 H 2 Z M 3 8 H 4 V 4 H 2 V 5 H 3 Z M 2 11 H 3.8 L 2 13.1 V 14 H 5 V 13 H 3.2 L 5 10.9 V 10 H 2 Z M 7 5 V 7 H 21 V 5 Z M 7 19 H 21 V 17 H 7 Z m 0 -6 H 21 V 11 H 7 Z"
      />
    </svg>
  );
}

PlannerIcon.propTypes = {
  color: PropTypes.string
};

export default PlannerIcon;
