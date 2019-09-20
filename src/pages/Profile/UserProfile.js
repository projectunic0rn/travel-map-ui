import React from "react";
import { Query } from "react-apollo";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import Loader from "../../components/common/Loader/Loader";
import { GET_USER_COUNTRIES } from "../../GraphQL";
import Profile from "./Profile";

// the match prop is passed from react-router-dom and provides url parameters
function UserProfile({ match }) {
  let username = match.params.username;
  // let username;
  // useEffect(() => {
  //   username = match.params.username;
  //   console.log("user profile rendered");
  //   console.log(match.params.id);
  // });

  return (
    <Query
      query={GET_USER_COUNTRIES}
      notifyOnNetworkStatusChange={true}
      variables={{ username }}
      fetchPolicy={"cache-and-network"}
      partialRefetch={true}
    >
      {({ loading, error, data }) => {
        if (loading) return <h1>Loading</h1>;
        if (error) return `Error! ${error}`;
        // return <UserProfile context={data.user} />;
        return <Profile username={username} context={data.user} />;
      }}
    </Query>
  );
}

UserProfile.propTypes = {
  match: PropTypes.object
};

export default withRouter(UserProfile);
