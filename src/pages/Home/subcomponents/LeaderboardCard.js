import React from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import UserAvatar from "../../../components/UserAvatar/UserAvatar";

function LeaderboardCard({ user, rank }) {
  function handleFontSize() {
    console.log(user.username);
    if (user.username.length < 13) {
      console.log(user.username);
      return "18px";
    } else if (user.username.length < 16) {
      return "16px";
    } else if (user.username.length < 18) {
      return "14px";
    } else if (user.username.length < 24) {
      return "12px";
    } else {
      return "10px";
    }
  }
  return (
    <NavLink
      to={{
        pathname: `/profiles/${user.username}/cities`,
        state: { searchText: "" }
      }}
    >
      <div className="user-trip-card leaderboard-card">
        <span className="lc-rank">{rank + 1}</span>
        <div className="user-profile-image">
          <UserAvatar
            avatarIndex={user.avatarIndex !== null ? user.avatarIndex : 1}
            color={user.color}
          />
        </div>
        <div className="utc-user-info-container">
          <span
            className="utc-username"
            style={{
              fontSize:
                user.username.length < 14
                  ? "18px"
                  : user.username.length < 16
                  ? "16px"
                  : user.username.length < 18
                  ? "14px"
                  : user.username.length < 24
                  ? "12px"
                  : "10px"
            }}
          >
            {user.username}
          </span>
          <span className="utc-location">
            {user.Place_living !== null
              ? user.Place_living.city + ", " + user.Place_living.countryISO
              : "       "}
          </span>
        </div>
        <div className="user-georney-score">
          <span>{Math.ceil(user.georneyScore)}</span>
        </div>
      </div>
    </NavLink>
  );
}

LeaderboardCard.propTypes = {
  user: PropTypes.object,
  rank: PropTypes.number
};

export default withRouter(LeaderboardCard);
