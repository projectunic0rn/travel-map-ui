import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import BloggerFilterCard from "./BloggerFilterCard";
import CloseWindowIcon from "../../../icons/CloseWindowIcon";

function BloggerLeaderboardPrompt({
  users,
  handleLeaderboard,
  sendUserClicked,
  activeBlogger,
  handleActiveBlogger,
}) {
  const [filteredUsers, handleFilteredUsers] = useState([]);
  const [searchText, handleSearchText] = useState("");

  useEffect(() => {
    let newFilteredUsers = users.filter(
      (friend) =>
        friend.username.toLowerCase().indexOf(searchText.toLowerCase()) > -1
    );
    handleFilteredUsers(newFilteredUsers);
  }, [searchText, users]);

  function handleClick(user) {
    let state = true;
    if (user.id === activeBlogger) {
      state = false;
      handleActiveBlogger(null);
    } else {
      handleActiveBlogger(user.id);
    }
    sendUserClicked(user, state);
  }

  return (
    <div className="leaderboard-container blogger-filter-container">
      <div onClick={() => handleLeaderboard(false)}>
        <CloseWindowIcon />
      </div>
      <span className="leaderboard-title">
        <input
          className="leaderboard-profile-search"
          type="search"
          placeholder="Type or click name to filter"
          onChange={(e) => handleSearchText(e.target.value)}
        ></input>
      </span>
      <div className="bloggers">
        {filteredUsers
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
  activeBlogger: PropTypes.string,
  handleActiveBlogger: PropTypes.func,
};

export default BloggerLeaderboardPrompt;
