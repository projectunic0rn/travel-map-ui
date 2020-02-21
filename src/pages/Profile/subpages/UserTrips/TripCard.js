import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";

import { Mutation } from "react-apollo";
import {
  REMOVE_PLACE_VISITING,
  REMOVE_PLACE_VISITED,
  REMOVE_PLACE_LIVING
} from "../../../../GraphQL";

import TrashIcon from "../../../../icons/TrashIcon";
import CalendarIcon from "../../../../icons/CalendarIcon";
import LocationIcon from "../../../../icons/LocationIcon";
import CountryIcon from "../../../../icons/CountryIcon";
import CircleIcon from "../../../../icons/CircleIcon";
import CityIcon from "../../../../icons/CityIcon";
import SimpleLoader from "../../../../components/common/SimpleLoader/SimpleLoader";

function TripCard({
  tripData,
  color,
  refetch,
  handleSelectedCity,
  urlUsername
}) {
  const [loaded, handleLoaded] = useState(true);
  const [localCityData] = useState(tripData);
  const [placeCount, handlePlaceCount] = useState(0);
  const [countryCount, handleCountryCount] = useState(tripData.countries);
  const [cityCount, handleCityCount] = useState(tripData.cities);
  const [placeVisitedId] = useState(
    tripData.timing === "past" ? tripData.id : null
  );
  const [placeVisitingId] = useState(
    tripData.timing === "future" ? tripData.id : null
  );
  const [placeLivingId] = useState(
    tripData.timing === "live" ? tripData.id : null
  );
  const [mutationToUse] = useState(
    tripData.timing === "past"
      ? REMOVE_PLACE_VISITED
      : tripData.timing === "future"
      ? REMOVE_PLACE_VISITING
      : REMOVE_PLACE_LIVING
  );
  console.log(tripData)
  const [deletePrompt, handleDelete] = useState(false);
//   useEffect(() => {
//     let places = 0;
//     let activities = 0;
//     let meals = 0;
//     let logistics = 0;
//     for (let i in cityData.CityReviews) {
//       switch (cityData.CityReviews[i].attraction_type) {
//         case "monument":
//           places++;
//           break;
//         case "nature":
//           places++;
//           break;
//         case "place":
//           places++;
//           break;
//         case "stay":
//           places++;
//           break;
//         case "tour":
//           activities++;
//           break;
//         case "outdoor":
//           activities++;
//           break;
//         case "shopping":
//           activities++;
//           break;
//         case "activity":
//           activities++;
//           break;
//         case "breakfast":
//           meals++;
//           break;
//         case "lunch":
//           meals++;
//           break;
//         case "dinner":
//           meals++;
//           break;
//         case "dessert":
//           meals++;
//           break;
//         case "drink":
//           meals++;
//           break;
//         case "logistics":
//           logistics++;
//           break;
//       }
//       handleMealCount(meals);
//       handlePlaceCount(places);
//       handleActivityCount(activities);
//       handleLogisticsCount(logistics);
//     }
//     handleLoaded(true);
//   }, [tripData]);
  if (!loaded) return <SimpleLoader />;
  return (
    <div className="ptc-card-container">
      <NavLink
        to={
          urlUsername !== undefined
            ? `/profiles/${urlUsername}/cities/${tripData.tripName.toLowerCase()}/`
            : `/profile/cities/${tripData.tripName.toLowerCase()}/`
        }
      >
        <div
          className="profile-trip-card"
          onClick={() =>
            handleSelectedCity(localCityData, localCityData.CityReviews)
          }
        >
          <div className="ptc-trip-info">
            <span
              className="ptc-trip"
              style={tripData.tripName.length > 18 ? { fontSize: "24px" } : null}
            >
              {tripData.tripName}
            </span>
            <span className="ptc-timing">
                {tripData.season + " " + tripData.year}
            </span>
          </div>
          <div className="ptc-trip-stats">
            <div className="ptc-stat" id="ptc-days">
              <CalendarIcon />
              <span>
                {tripData.days > 99
                  ? "99+"
                  : tripData.days !== null
                  ? tripData.days
                  : 0}
              </span>
            </div>
            <div className="ptc-stat" id="ptc-countries">
              <CountryIcon />
              <span>{countryCount > 99 ? "99+" : countryCount}</span>
            </div>
            <div className="ptc-stat" id="ptc-cities">
              <CityIcon />
              <span>{cityCount > 99 ? "99+" : cityCount}</span>
            </div>
          </div>
          <CircleIcon color={color} />
        </div>
      </NavLink>
      <Mutation
        mutation={mutationToUse}
        variables={
          tripData.timing === "past"
            ? { placeVisitedId }
            : tripData.timing === "future"
            ? { placeVisitingId }
            : { placeLivingId }
        }
        onCompleted={() => refetch()}
      >
        {mutation => (
          <div
            className={deletePrompt ? "delete-prompt" : "delete-prompt-hide"}
          >
            <span>Are you sure you want to delete {tripData.tripName}?</span>
            <div>
              <button className="button confirm" onClick={mutation}>
                Yes
              </button>
              <button
                className="button deny"
                onClick={() => handleDelete(false)}
              >
                No
              </button>
            </div>
          </div>
        )}
      </Mutation>
      {!urlUsername ? (
        <button className="button trash" onClick={() => handleDelete(true)}>
          <TrashIcon />
        </button>
      ) : null}
    </div>
  );
}

TripCard.propTypes = {
  tripData: PropTypes.object,
  color: PropTypes.string,
  handleSelectedCity: PropTypes.func,
  urlUsername: PropTypes.string,
  refetch: PropTypes.func
};

export default withRouter(TripCard);
