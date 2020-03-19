import React from "react";
import PropTypes from "prop-types";
import LeaderboardCard from "../../pages/Home/subcomponents/LeaderboardCard";
import CloseWindowIcon from '../../icons/CloseWindowIcon';

function LeaderboardPrompt({ users, handleLeaderboard}) {
  return (
    <div className="leaderboard-container">
      <div onClick = {() => handleLeaderboard(false)}><CloseWindowIcon /></div>
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
  users: PropTypes.array,
  handleLeaderboard: PropTypes.func
};

export default LeaderboardPrompt;
