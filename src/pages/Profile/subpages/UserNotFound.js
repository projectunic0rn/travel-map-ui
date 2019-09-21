import React from "react";
import PropTypes from "prop-types";

function UserNotFound({ username }) {
  return (
    <div className="not-found-container">
      <h1 className="not-found-header">User {username} does not exist.</h1>
    </div>
  );
}

UserNotFound.propTypes = {
  username: PropTypes.string.isRequired
};

export default UserNotFound;
