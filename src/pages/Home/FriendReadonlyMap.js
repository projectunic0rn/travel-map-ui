import React, { useState } from "react";
import { NavLink, withRouter } from "react-router-dom";
import Swal from "sweetalert2";
import { Query } from "react-apollo";
import { GET_ALL_CITY_DETAILS } from "../../GraphQL";
import jsonData from "../../geoJsonCountries.json";

import FriendReadonlyCity from "./subcomponents/FriendReadonlyCity";
import Loader from "../../components/common/Loader/Loader";
import PageNotFound from "../../components/common/PageNotFound/PageNotFound";

const FriendReadonlyMap = () => {
  const [loaded, handleLoaded] = useState(false);
  const [cityOrCountry] = useState(1);
  const [countryArray, addCountry] = useState([]);
  const [tripData, handleTripData] = useState([]);
  const [geoJsonArray, handleGeoJsonArray] = useState([]);
  const [filteredCountryJsonData, handleFilteredCountryJsonData] = useState();

  const username = window.location.pathname.split("/")[2];

  function getJsonData(data) {
    let newGeoJsonArray = [];

    data.Places_visited.forEach((city) => {
      let item = {
        type: "Feature",
        properties: {
          city: {
            id: city.id,
            city: city.city,
            cityId: city.cityId,
            latitude: city.city_latitude,
            longitude: city.city_longitude,
            tripTiming: 0,
          },
        },
        geometry: {
          type: "Point",
          coordinates: [city.city_longitude, city.city_latitude],
        },
      };
      item.properties.icon = "0";

      newGeoJsonArray.push(item);
      return;
    });
    data.Places_visiting.forEach((city) => {
      let item = {
        type: "Feature",
        properties: {
          city: {
            id: city.id,
            city: city.city,
            cityId: city.cityId,
            latitude: city.city_latitude,
            longitude: city.city_longitude,
            tripTiming: 1,
          },
        },
        geometry: {
          type: "Point",
          coordinates: [city.city_longitude, city.city_latitude],
        },
      };
      item.properties.icon = "1";

      newGeoJsonArray.push(item);
      return;
    });
    if (data.Place_living !== undefined && data.Place_living !== null) {
      let item = {
        type: "Feature",
        properties: {
          city: {
            id: data.Place_living.id,
            city: data.Place_living.city,
            cityId: data.Place_living.cityId,
            latitude: data.Place_living.city_latitude,
            longitude: data.Place_living.city_longitude,
            tripTiming: 2,
          },
        },
        geometry: {
          type: "Point",
          coordinates: [
            data.Place_living.city_longitude,
            data.Place_living.city_latitude,
          ],
        },
      };
      item.properties.icon = "2";

      newGeoJsonArray.push(item);
    }
    handleGeoJsonArray(newGeoJsonArray);
    getJsonCountries(data);
  }

  function getJsonCountries(data) {
    let userCities = [];
    data.Places_visited.map((city) => {
      city.tripTiming = 0;
    });
    data.Places_visiting.map((city) => {
      city.tripTiming = 1;
    });
    if (data.Place_living !== null) {
      data.Place_living.tripTiming = 2;
      userCities = [data.Place_living]
        .concat(data.Places_visited)
        .concat(data.Places_visiting);
    } else {
      userCities = data.Places_visited.concat(data.Places_visiting);
    }

    let newCountryArray = [];
    let newFilteredCountryData = [];
    for (let i = 0; i < userCities.length; i++) {
      var newGeoJson = {};
      if (
        !newCountryArray.some((country) => {
          return (
            country.countryISO === userCities[i].countryISO &&
            country.tripTiming === userCities[i].tripTiming
          );
        })
      ) {
        newCountryArray.push({
          countryId: userCities[i].countryId,
          country: userCities[i].country,
          tripTiming: userCities[i].tripTiming,
          countryISO: userCities[i].countryISO,
        });
        let geoJson = jsonData.features.find(
          (jsonCountry) =>
            userCities[i].countryISO === jsonCountry.properties.ISO2
        );
        if (geoJson) {
          newGeoJson = JSON.parse(JSON.stringify(geoJson));
          switch (userCities[i].tripTiming) {
            case 0:
              newGeoJson.properties.icon = "0";
              break;
            case 1:
              newGeoJson.properties.icon = "1";
              break;
            case 2:
              newGeoJson.properties.icon = "2";
              break;
            default:
              break;
          }
          newFilteredCountryData.push(newGeoJson);
        }
      }
    }
    addCountry(newCountryArray);
    handleFilteredCountryJsonData(newFilteredCountryData);
    handleLoaded(true);
  }

  function handleTripDataHelper(data) {
    handleTripData(data);
    getJsonData(data);
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
        // handleLoadedCountries(data);
        if (!loaded) return <Loader />;
        return (
          <>
            {localStorage.token !== undefined ? <div style={{height: "60px"}}></div> : null}
            <div className="map-container" id="map-readonly">
              <span className="user-map-name">{username + "'s Map"}</span>
              {cityOrCountry ? (
                <NavLink to={`/`}>
                  <button className="create-map">CREATE MY MAP</button>
                </NavLink>
              ) : null}
              <div
                className={cityOrCountry ? "map city-map" : "map country-map"}
              >
                <FriendReadonlyCity
                  tripData={tripData}
                  geoJsonArray={geoJsonArray}
                  filteredCountryJsonData={filteredCountryJsonData}
                  countryArray={countryArray}
                />
              </div>
              <span className="georney-score" onClick={() => geoScoreSwal()}>
                <span className="gs-title">{"GeorneyScore"}</span>
                <span className="gs-score">
                  {Math.ceil(data.user.georneyScore)}
                </span>
              </span>
            </div>
          </>
        );
      }}
    </Query>
  );
};

export default withRouter(FriendReadonlyMap);
