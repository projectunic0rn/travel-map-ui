import React from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import UserAvatar from "../../../UserAvatar/UserAvatar";

function UserTripCard(props) {
  console.log(props);
  return (
    <NavLink
      to={
        props.trip.cities === undefined
          ? `/profiles/${props.trip.username}/cities/${props.trip.city.toLowerCase()}/${props.trip.tripTiming}/${props.trip.id}/`
          : `/profiles/${props.trip.username}/cities`
      }
    >
      <div className="user-trip-card">
        <div className="user-profile-image">
          <UserAvatar
            avatarIndex={props.trip.avatarIndex}
            color={props.trip.color}
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
    </NavLink>
  );
}

UserTripCard.propTypes = {
  trip: PropTypes.object,
  metricValue: PropTypes.number,
  metric: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default withRouter(UserTripCard);
