import React from 'react';
import PropTypes from 'prop-types';

export default function UserActivity(props) {
  const { friendCount, countryCount, cityCount } = props;
  return (
    <div className="user-activity-block">
      <div className="activity-block">
        <span className="count">{ friendCount }</span>
        <span className="label">Friends</span>
      </div>
      <div className="activity-block">
        <span className="count">{ countryCount }</span>
        <span className="label">Countries</span>
      </div>
      <div className="activity-block">
        <span className="count">{ cityCount }</span>
          <span className="label">Cities</span>
      </div>
    </div>
  )
}

UserActivity.propTypes = {
  friendCount: PropTypes.number,
  countryCount: PropTypes.number,
  cityCount: PropTypes.number
};
