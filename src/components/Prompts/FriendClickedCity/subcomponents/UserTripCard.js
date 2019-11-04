import React from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import UserAvatar from "../../../UserAvatar/UserAvatar";

function UserTripCard(props) {
  return (
    <div className="user-trip-card">
      <NavLink to={`/profiles/${props.trip.username}/`}>
        <div className="user-profile-image">
          <UserAvatar
            avatarIndex={props.trip.avatarIndex}
            color={props.trip.color}
          />
        </div>
      </NavLink>
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
        <p />
      </div>
    </div>
  );
}

UserTripCard.propTypes = {
  trip: PropTypes.object,
  metricValue: PropTypes.number,
  metric: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default withRouter(UserTripCard);
