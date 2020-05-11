import React from "react";
import PropTypes from "prop-types";
import UserAvatar from "../../../components/UserAvatar/UserAvatar";

function BloggerFilterCard({ user, rank, handleClick }) {
  return (
    <div className="user-trip-card leaderboard-card" onClick={() => handleClick(user)}>
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
                : "10px",
          }}
        >
          {user.username}
        </span>
        <span className="utc-location">
          {user.Place_living !== null
            ? user.Place_living.city !== ""
              ? user.Place_living.city + ", " + user.Place_living.countryISO
              : user.Place_living.country
            : "       "}
        </span>
      </div>
      <div className="user-georney-score">
        <span>{Math.ceil(user.georneyScore)}</span>
      </div>
    </div>
  );
}

BloggerFilterCard.propTypes = {
  user: PropTypes.object,
  rank: PropTypes.number,
  handleClick: PropTypes.func,
};

export default BloggerFilterCard;
