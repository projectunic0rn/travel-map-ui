import React from "react";
import PropTypes from 'prop-types';

function HistoryIcon({ color }) {
  return (
    <svg
      className="interest-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 19 21"
      width="19"
      height="21"
    >
      <path
        id="ic_account_balance_24px"
        fill={color}
        transform="translate(-2 -1)"
        d="M 4 10 v 7 H 7 V 10 Z m 6 0 v 7 h 3 V 10 Z M 2 22 H 21 V 19 H 2 Z M 16 10 v 7 h 3 V 10 Z M 11.5 1 L 2 6 V 8 H 21 V 6 Z"
      />
    </svg>
  );
}

HistoryIcon.propTypes = {
  color: PropTypes.string
}

export default HistoryIcon;
