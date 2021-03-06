import React from "react";
import PropTypes from "prop-types";

function BloggerFilterCard({ user, handleClick, activeCard }) {
  function handleClickHelper(user) {
    handleClick(user);
  }

  return (
    <div
      id={activeCard === user.id ? "blogger-card-clicked" : null}
      className="user-trip-card leaderboard-card blogger-card"
      onClick={() => handleClickHelper(user)}
    >
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
  activeCard: PropTypes.string
};

export default BloggerFilterCard;
