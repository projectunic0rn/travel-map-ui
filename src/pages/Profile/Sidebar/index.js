import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";

import { GET_USER_COUNTRIES, GET_LOGGEDIN_USER } from "../../../GraphQL";
import UserDetails from "./UserDetails";
import UserActivity from "./UserActivity";
import SimpleLoader from "../../../components/common/SimpleLoader/SimpleLoader";
import InterestTag from "./InterestTag";

export default function Sidebar({
  city,
  country,
  countryCount,
  cityCount,
  userData,
  urlUsername,
  refetch
}) {
  const fakeUser = {
    friendCount: 0
  };
  const [age, handleAge] = useState("");
  useEffect(() => {
    calculateAge(userData.birthday);
  }, [userData]);

  function calculateAge(birthDate) {
    if (birthDate === null) {
      return;
    }
    birthDate = new Date(birthDate);
    let otherDate = new Date();

    var years = otherDate.getFullYear() - birthDate.getFullYear();

    if (
      otherDate.getMonth() < birthDate.getMonth() ||
      (otherDate.getMonth() === birthDate.getMonth() &&
        otherDate.getDate() < birthDate.getDate())
    ) {
      years--;
    }
    handleAge(years);
  }
  return (
    <div className="sidebar">
      <Query
        query={urlUsername ? GET_USER_COUNTRIES : GET_LOGGEDIN_USER}
        notifyOnNetworkStatusChange
        fetchPolicy={"cache-and-network"}
        partialRefetch={true}
        variables={urlUsername ? { username: urlUsername } : {}}
      >
        {({ loading, error, data }) => {
          if (loading) return <SimpleLoader color="#ccc" />;
          if (error) return <p>{error.toString()}</p>;
          return (
            <Fragment>
              <UserDetails
                username={data.user.username}
                age={Number(age)}
                city={city}
                country={country}
                avatarIndex={userData.avatarIndex}
                color={userData.color}
                refetch={refetch}
              />
              <UserActivity
                friendCount={fakeUser.friendCount}
                countryCount={countryCount}
                cityCount={cityCount}
              />
              {/* TODO: move tags to component */}
              <div className="user-tags">
                {data.user.UserInterests.map((interest) => {
                  return <InterestTag key={interest.id} name={interest.name} />;
                })}
              </div>
            </Fragment>
          );
        }}
      </Query>
    </div>
  );
}

Sidebar.propTypes = {
  city: PropTypes.string,
  country: PropTypes.string,
  countryCount: PropTypes.number,
  cityCount: PropTypes.number,
  urlUsername: PropTypes.string,
  userData: PropTypes.object,
  refetch: PropTypes.func
};
