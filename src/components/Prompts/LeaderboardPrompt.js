import React from "react";
import PropTypes from "prop-types";
import LeaderboardCard from "../../pages/Home/subcomponents/LeaderboardCard";

function LeaderboardPrompt({ users }) {
  return (
    <div className="leaderboard-container">
      <span className="leaderboard-title">GeorneyScores</span>
      <data>
        {users
          .sort((a, b) => b.georneyScore - a.georneyScore)
          .map((user, index) => {
            return <LeaderboardCard key={user.id} user={user} rank={index} />;
          })}
      </data>
    </div>
  );
}

LeaderboardPrompt.propTypes = {
  users: PropTypes.array
};

export default LeaderboardPrompt;
