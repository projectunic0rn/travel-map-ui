import React from "react";
import PropTypes from "prop-types";
import BloggerFilterCard from "./BloggerFilterCard";
import CloseWindowIcon from "../../../icons/CloseWindowIcon";

function BloggerLeaderboardPrompt({
  users,
  handleLeaderboard,
  sendUserClicked,
  activeBlogger, 
  handleActiveBlogger
}) {

  function handleClick(user, rank) {
    let state = true;
    if (rank === activeBlogger) {
      state = false;
      rank = null;
    }
    sendUserClicked(user, state);
    handleActiveBlogger(rank);
  }

  return (
    <div className="leaderboard-container blogger-filter-container">
      <div onClick={() => handleLeaderboard(false)}>
        <CloseWindowIcon />
      </div>
      <span className="leaderboard-title">Click to filter bloggers</span>
      <div className = 'bloggers'>
        {users
          .sort((a, b) => b.georneyScore - a.georneyScore)
          .map((user, index) => {
            return (
              <BloggerFilterCard
                key={user.id}
                user={user}
                rank={index}
                handleClick={handleClick}
                activeCard={activeBlogger}
              />
            );
          })}
      </div>
    </div>
  );
}

BloggerLeaderboardPrompt.propTypes = {
  users: PropTypes.array,
  handleLeaderboard: PropTypes.func,
  sendUserClicked: PropTypes.func,
  activeBlogger: PropTypes.number,
  handleActiveBlogger: PropTypes.func
};

export default BloggerLeaderboardPrompt;
