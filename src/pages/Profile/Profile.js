import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_PROFILE_BASICS } from "../../GraphQL";
import { ProfileProvider } from './ProfileContext';

import Sidebar from "./Sidebar";
import ProfileNav from "./ProfileNav";
import Trips from "./subpages/Trips";
import Media from "./subpages/Media";
import Friends from "./subpages/Friends";
import Settings from "./subpages/Settings";



export default function Profile(props) {
  return (<Query
    query={GET_PROFILE_BASICS}
    notifyOnNetworkStatusChange
    fetchPolicy={"cache-and-network"}
    partialRefetch={true}
  >
    {({ loading, error, data }) => {
      if (loading) return <div>Loading...</div>;
      if (error) return `Error! ${error}`;
      return (
        <div className="page page-profile">
          <ProfileProvider value = {data.user}><div className="container">
            <Sidebar userData = {props.context}/>
            <ProfileNav />
            <Route path="/profile/" exact component={Trips} />
            <Route path="/profile/trips" exact component={Trips} />
            <Route path="/profile/media" exact component={Media} />
            <Route path="/profile/friends" exact component={Friends} />
            <Route path="/profile/settings" exact component={Settings} />
          </div></ProfileProvider>
        </div>
      );
    }}
  </Query>
  )
}

Profile.propTypes = {
  context: PropTypes.object,
}