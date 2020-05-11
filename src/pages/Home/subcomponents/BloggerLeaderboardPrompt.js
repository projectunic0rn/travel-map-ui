import React, { useState } from "react";
import PropTypes from "prop-types";
import BloggerFilterCard from "./BloggerFilterCard";
import CloseWindowIcon from "../../../icons/CloseWindowIcon";

function BloggerLeaderboardPrompt({ users, handleLeaderboard, sendUserClicked }) {
  const [userClicked, handleUserClicked] = useState(null);

    function handleClick(user) {
        console.log(user);
        sendUserClicked(user);
    }

  return (
    <div className="leaderboard-container">
      <div onClick={() => handleLeaderboard(false)}>
        <CloseWindowIcon />
      </div>
      <span className="leaderboard-title">GeorneyScores</span>
      <data>
        {users
          .sort((a, b) => b.georneyScore - a.georneyScore)
          .map((user, index) => {
            return <BloggerFilterCard key={user.id} user={user} rank={index} handleClick={handleClick}/>;
          })}
      </data>
    </div>
  );
}

BloggerLeaderboardPrompt.propTypes = {
  users: PropTypes.array,
  handleLeaderboard: PropTypes.func,
  sendUserClicked: PropTypes.func
};

export default BloggerLeaderboardPrompt;
