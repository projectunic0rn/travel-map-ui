import React from "react";
import { Query } from "react-apollo";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import Loader from "../../components/common/Loader/Loader";
import { GET_USER_COUNTRIES } from "../../GraphQL";
import Profile from "./Profile";
import UserNotFound from "./subpages/UserNotFound";

// the match prop is passed from react-router-dom and provides url parameters
function UserProfile({ match }) {
  let urlUsername = match.params.username;

  return (
    <div className="user-profile">
      <Query
        query={GET_USER_COUNTRIES}
        notifyOnNetworkStatusChange={true}
        variables={{ username: urlUsername }}
        fetchPolicy={"cache-and-network"}
        partialRefetch={true}
      >
        {({ loading, error, data }) => {
          if (loading) return <Loader />;
          if (error) return `Error! ${error}`;
          if (!data.user) return <UserNotFound />;
          return <Profile urlUsername={urlUsername} user={data.user} />;
        }}
      </Query>
    </div>
  );
}

UserProfile.propTypes = {
  match: PropTypes.object
};

export default withRouter(UserProfile);