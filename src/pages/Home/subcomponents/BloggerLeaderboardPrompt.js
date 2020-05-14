import React, { useState } from "react";
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
  const [userClicked, handleUserClicked] = useState(false);

  function handleClick(user, rank) {
    let state = true;
    if (rank === activeBlogger) {
      state = !userClicked;
      rank = null;
    }
    sendUserClicked(user, state);
    handleUserClicked(state);
    handleActiveBlogger(rank);
  }

  return (
    <div className="leaderboard-container blogger-filter-container">
      <div onClick={() => handleLeaderboard(false)}>
        <CloseWindowIcon />
      </div>
      <span className="leaderboard-title">Click to filter bloggers</span>
      <bloggers>
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
      </bloggers>
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
