import React from "react";
import PropTypes from "prop-types";
import UserAvatar from "../../../components/UserAvatar/UserAvatar";

function FakeUserTripCard(props) {
  return (

      <div className="user-trip-card">
        <div className="user-profile-image">
          <UserAvatar
            avatarIndex={props.trip.avatarIndex !== null ? props.trip.avatarIndex : 1}
            color={props.trip.color}
            email={""}
          />
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

export default FakeUserTripCard;
