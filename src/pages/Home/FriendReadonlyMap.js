import React, { useState, useEffect } from "react";
import { NavLink, withRouter } from "react-router-dom";
import Swal from "sweetalert2";
import { Query } from "react-apollo";
import { GET_ALL_CITY_DETAILS } from "../../GraphQL";
import FriendReadonlyCountry from "./subcomponents/FriendReadonlyCountry";
import FriendReadonlyCity from "./subcomponents/FriendReadonlyCity";
import Loader from "../../components/common/Loader/Loader";
import PageNotFound from "../../components/common/PageNotFound/PageNotFound";

const FriendReadonlyMap = () => {
  const [loaded, handleLoaded] = useState(false);
  const [cityOrCountry, handleMapTypeChange] = useState(1);
  const [clickedCountryArray, addCountry] = useState([]);
  const [tripData, handleTripData] = useState([]);
  const username = window.location.pathname.split("/")[2];
  const swalParams = {
    type: "info",
    text:
      "This website works best on wider screens, please switch to a bigger screen or hold your device horizontally.",
    confirmButtonColor: "#656F80"
  };

  const [swalNotFired, setSwalNotFired] = useState(true);
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);
  useEffect(() => {
    if (window.innerWidth < 1000 && swalNotFired) {
      Swal.fire(swalParams);
      setSwalNotFired(false);
    }

    function resizeListener() {
      if (window.innerWidth < 1000 && swalNotFired) {
        Swal.fire(swalParams);
        setSwalNotFired(false);
      }
    }

    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, [swalNotFired, swalParams]);
  function handleLoadedCountries(data) {
    let countryArray = clickedCountryArray;
    let userData = data.user;
    if (userData != null && userData.Places_visited.length !== 0) {
      for (let i = 0; i < userData.Places_visited.length; i++) {
        if (
          !countryArray.some(country => {
            return country.countryId === userData.Places_visited[i].countryId;
          })
        ) {
          countryArray.push({
            username: userData.username,
            countryId: userData.Places_visited[i].countryId,
            tripTiming: 0
          });
        }
      }
    }
    if (userData != null && userData.Places_visiting.length !== 0) {
      for (let i = 0; i < userData.Places_visiting.length; i++) {
        if (
          !countryArray.some(country => {
            return country.countryId === userData.Places_visiting[i].countryId;
          })
        ) {
          countryArray.push({
            username: userData.username,
            countryId: userData.Places_visiting[i].countryId,
            tripTiming: 1
          });
        }
      }
    }
    if (userData != null && userData.Place_living !== null) {
      if (
        !countryArray.some(country => {
          return country.countryId === userData.Place_living.countryId;
        })
      ) {
        countryArray.push({
          username: userData.username,
          countryId: userData.Place_living.countryId,
          tripTiming: 2
        });
      }
    }

    addCountry(countryArray);
  }

  function handleTripDataHelper(data) {
    handleTripData(data);
    handleLoaded(true);
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
      onCompleted={data => handleTripDataHelper(data.user)}
    >
      {({ loading, error, data, refetch }) => {
        if (loading) return <Loader />;
        if (error) return `Error! ${error}`;
        handleLoadedCountries(data);
        if (!loaded) return <Loader />;
        return (
          <div className="map-container">
            <span className="user-map-name">{username + "'s Map"}</span>
            {cityOrCountry ? (
              <NavLink to={`/new`}>
                <button className="create-map">CREATE MY MAP</button>
              </NavLink>
            ) : null}
            <div className={cityOrCountry ? "map city-map" : "map country-map"}>
              {cityOrCountry ? (
                <FriendReadonlyCity
                  tripData={tripData}
                  handleMapTypeChange={handleMapTypeChange}
                />
              ) : (
                <FriendReadonlyCountry
                  clickedCountryArray={clickedCountryArray}
                  tripData={tripData}
                  handleMapTypeChange={handleMapTypeChange}
                  refetch={refetch}
                />
              )}
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default withRouter(FriendReadonlyMap);
