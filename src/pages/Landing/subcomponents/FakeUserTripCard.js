import React from "react";
import PropTypes from "prop-types";
import avatar from '../../../images/Avatar_trial8_rotate_12_yellow.png';

function FakeUserTripCard(props) {
  return (

      <div className="user-trip-card">
        <div className="user-profile-image">
          <img src={avatar} style={{width: "50px"}}  alt="avatar"/>
        </div>
        <div className="utc-user-info-container">
          <span className="utc-username">{props.trip.username}</span>
          <span className="utc-duration">
            {props.metricValue} {props.metric}
          </span>
        </div>
        <div
          className={
            "utc-year-container utc-year-container-" + props.trip.tripTiming
          }
        >
          <p className="utc-year">{props.trip.year}</p>
        </div>
      </div>
  );
}

FakeUserTripCard.propTypes = {
  trip: PropTypes.object,
  metricValue: PropTypes.number,
  metric: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default React.memo(FakeUserTripCard);
