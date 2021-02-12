import React, { useState, useEffect } from "react";
import { NavLink, withRouter } from "react-router-dom";
import Swal from "sweetalert2";
import { Query } from "react-apollo";
import { GET_ALL_CITY_DETAILS } from "../../GraphQL";
import FriendReadonlyCity from "./subcomponents/FriendReadonlyCity";
import Loader from "../../components/common/Loader/Loader";
import PageNotFound from "../../components/common/PageNotFound/PageNotFound";

const FriendReadonlyMap = () => {
  const [loaded, handleLoaded] = useState(false);
  const [cityOrCountry, handleMapTypeChange] = useState(1);
  const [clickedCountryArray, addCountry] = useState([]);
  const [tripData, handleTripData] = useState([]);
  const username = window.location.pathname.split("/")[2];

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  function handleLoadedCountries(data) {
    let countryArray = clickedCountryArray;
    let userData = data.user;
    if (userData != null && userData.Places_visited.length !== 0) {
      for (let i = 0; i < userData.Places_visited.length; i++) {
        if (
          !countryArray.some((country) => {
            return country.countryId === userData.Places_visited[i].countryId;
          })
        ) {
          countryArray.push({
            username: userData.username,
            countryId: userData.Places_visited[i].countryId,
            tripTiming: 0,
          });
        }
      }
    }
    if (userData != null && userData.Places_visiting.length !== 0) {
      for (let i = 0; i < userData.Places_visiting.length; i++) {
        if (
          !countryArray.some((country) => {
            return country.countryId === userData.Places_visiting[i].countryId;
          })
        ) {
          countryArray.push({
            username: userData.username,
            countryId: userData.Places_visiting[i].countryId,
            tripTiming: 1,
          });
        }
      }
    }
    if (userData != null && userData.Place_living !== null) {
      if (
        !countryArray.some((country) => {
          return country.countryId === userData.Place_living.countryId;
        })
      ) {
        countryArray.push({
          username: userData.username,
          countryId: userData.Place_living.countryId,
          tripTiming: 2,
        });
      }
    }

    addCountry(countryArray);
  }

  function handleTripDataHelper(data) {
    handleTripData(data);
    handleLoaded(true);
  }
  function geoScoreSwal() {
    const swalParams = {
      type: "content",
      text:
        "GeorneyScore is a representation of how much of the world you have seen, the higher you score the more points you gain. We use a special metric to calculate this, which you can check out in the FAQ page!",
      confirmButtonColor: "#656F80",
      closeOnClickOutside: true,
    };
    Swal.fire(swalParams);
  }
  if (window.location.pathname.split("/")[2] === undefined) {
    return <PageNotFound />;
  }

  return (
    <Query
      query={GET_ALL_CITY_DETAILS}
      variables={{ username }}
      notifyOnNetworkStatusChange
      fetchPolicy={"cache-and-network"}
      partialRefetch={true}
      onCompleted={(data) => handleTripDataHelper(data.user)}
    >
      {({ loading, error, data }) => {
        if (loading) return <Loader />;
        if (error) return `Error! ${error}`;
        handleLoadedCountries(data);
        if (!loaded) return <Loader />;
        return (
          <div className="map-container" id="map-readonly">
            <span className="user-map-name">{username + "'s Map"}</span>
            {cityOrCountry ? (
              <NavLink to={`/new`}>
                <button className="create-map">CREATE MY MAP</button>
              </NavLink>
            ) : null}
            <div className={cityOrCountry ? "map city-map" : "map country-map"}>
              <FriendReadonlyCity
                tripData={tripData}
                handleMapTypeChange={handleMapTypeChange}
              />
            </div>
            <span className="georney-score" onClick={() => geoScoreSwal()}>
              <span className="gs-title">{"GeorneyScore"}</span>
              <span className="gs-score">
                {Math.ceil(data.user.georneyScore)}
              </span>
            </span>
          </div>
        );
      }}
    </Query>
  );
};

export default withRouter(FriendReadonlyMap);
