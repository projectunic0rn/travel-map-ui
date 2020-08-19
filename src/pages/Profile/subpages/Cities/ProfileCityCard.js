import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import UserContext from "../../../../utils/UserContext";

import {
  REMOVE_PLACE_VISITING,
  REMOVE_PLACE_VISITED,
  REMOVE_PLACE_LIVING
} from "../../../../GraphQL";

import TrashIcon from "../../../../icons/TrashIcon";
import CalendarIcon from "../../../../icons/CalendarIcon";
import LocationIcon from "../../../../icons/LocationIcon";
import FoodieIcon from "../../../../icons/InterestIcons/FoodieIcon";
import CircleIcon from "../../../../icons/CircleIcon";
import ActivitiesIcon from "../../../../icons/InterestIcons/GuidedTouristIcon";
import SimpleLoader from "../../../../components/common/SimpleLoader/SimpleLoader";

function ProfileCityCard({
  cityData,
  color,
  handleSelectedCity,
  urlUsername
}) {
  const user = React.useContext(UserContext);
  const [loaded, handleLoaded] = useState(false);
  const [localCityData] = useState(cityData);
  const [placeCount, handlePlaceCount] = useState(0);
  const [activityCount, handleActivityCount] = useState(0);
  const [mealCount, handleMealCount] = useState(0);
  const [, handleLogisticsCount] = useState(0);
  const [placeVisitedId] = useState(
    cityData.tripTiming === 0 ? cityData.id : null
  );
  const [placeVisitingId] = useState(
    cityData.tripTiming === 1 ? cityData.id : null
  );
  const [placeLivingId] = useState(
    cityData.tripTiming === 2 ? cityData.id : null
  );
  const [mutationToUse] = useState(
    cityData.tripTiming === 0
      ? REMOVE_PLACE_VISITED
      : cityData.tripTiming === 1
      ? REMOVE_PLACE_VISITING
      : REMOVE_PLACE_LIVING
  );
  const [deletePrompt, handleDelete] = useState(false);
  useEffect(() => {
    let places = 0;
    let activities = 0;
    let meals = 0;
    let logistics = 0;
    for (let i in cityData.CityReviews) {
      switch (cityData.CityReviews[i].attraction_type) {
        case "monument":
          places++;
          break;
        case "nature":
          places++;
          break;
        case "place":
          places++;
          break;
        case "stay":
          places++;
          break;
        case "tour":
          activities++;
          break;
        case "outdoor":
          activities++;
          break;
        case "shopping":
          activities++;
          break;
        case "activity":
          activities++;
          break;
        case "breakfast":
          meals++;
          break;
        case "lunch":
          meals++;
          break;
        case "dinner":
          meals++;
          break;
        case "dessert":
          meals++;
          break;
        case "drink":
          meals++;
          break;
        case "logistics":
          logistics++;
          break;
      }
      handleMealCount(meals);
      handlePlaceCount(places);
      handleActivityCount(activities);
      handleLogisticsCount(logistics);
    }
    handleLoaded(true);
  }, [cityData]);
  function handleDeletedCity() {
    let userData = { ...user };
    let newClickedCityArray = userData.clickedCityArray.filter(city => city.id !== cityData.id);
    userData.clickedCityArray = newClickedCityArray;
    user.handleClickedCityArray(userData.clickedCityArray);
  }
  if (!loaded) return <SimpleLoader />;
  return (
    <div className="pcc-card-container">
      {/* <NavLink
        to={
          urlUsername !== undefined
            ? `/profiles/${urlUsername}/cities/${cityData.city.toLowerCase()}/`
            : `/profile/cities/${cityData.city.toLowerCase()}/`
        }
      > */}
        <div
          className="profile-city-card"
          onClick={() =>
            handleSelectedCity(localCityData, localCityData.CityReviews)
          }
        >
          <div className="pcc-city-info">
            <span
              className="pcc-city"
              style={cityData.city.length > 18 ? { fontSize: "24px" } : null}
            >
              {cityData.city}
            </span>
            <span className="pcc-country">
              {cityData.country.length < 25
                ? cityData.country
                : cityData.countryISO}
            </span>
          </div>
          <div className="pcc-city-stats">
            <div className="pcc-stat" id="pcc-days">
              <CalendarIcon />
              <span>
                {cityData.days > 99
                  ? "99+"
                  : cityData.days !== null
                  ? cityData.days
                  : 0}
              </span>
            </div>
            <div className="pcc-stat" id="pcc-places">
              <LocationIcon />
              <span>{placeCount > 99 ? "99+" : placeCount}</span>
            </div>
            <div className="pcc-stat" id="pcc-activities">
              <ActivitiesIcon />
              <span>{activityCount > 99 ? "99+" : activityCount}</span>
            </div>
            <div className="pcc-stat" id="pcc-meals">
              <FoodieIcon />
              <span>{mealCount > 99 ? "99+" : mealCount}</span>
            </div>
          </div>
          <CircleIcon color={color} />
        </div>
      {/* </NavLink> */}
      <Mutation
        mutation={mutationToUse}
        variables={
          cityData.tripTiming === 0
            ? { placeVisitedId }
            : cityData.tripTiming === 1
            ? { placeVisitingId }
            : { placeLivingId }
        }
        onCompleted={() => handleDeletedCity()}
      >
        {mutation => (
          <div
            className={deletePrompt ? "delete-prompt" : "delete-prompt-hide"}
          >
            <span>Are you sure you want to delete {cityData.city}?</span>
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

ProfileCityCard.propTypes = {
  cityData: PropTypes.object,
  color: PropTypes.string,
  handleSelectedCity: PropTypes.func,
  urlUsername: PropTypes.string,
};

export default withRouter(ProfileCityCard);
