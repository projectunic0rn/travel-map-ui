import React from "react";
import PropTypes from "prop-types";

function BloggerFilterCard({ user, rank, handleClick, activeCard }) {
  function handleClickHelper(user) {
    handleClick(user, rank);
  }

  return (
    <div
      id={activeCard === rank ? "blogger-card-clicked" : null}
      className="user-trip-card leaderboard-card blogger-card"
      onClick={() => handleClickHelper(user)}
    >
      <span className="blogger-rank">{rank + 1}</span>
      <div className="utc-user-info-container">
        <span className="utc-username">{user.username}</span>
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
