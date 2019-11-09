import React from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";

import CalendarIcon from "../../../../icons/CalendarIcon";
import LocationIcon from "../../../../icons/LocationIcon";
import FoodieIcon from "../../../../icons/InterestIcons/FoodieIcon";
import CircleIcon from "../../../../icons/CircleIcon";
import LogisticsIcon from "../../../../icons/LogisticsIcon";

function ProfileCityCard({ cityData, color, handleSelectedCity }) {
  return (
    <NavLink to={`/profile/cities/${cityData.city.toLowerCase()}/`}>
      <div className="profile-city-card" onClick={() => handleSelectedCity(cityData.city)}>
        <div className="pcc-city-info">
          <span className="pcc-city">{cityData.city}</span>
          <span className="pcc-country">{cityData.country}</span>
        </div>
        <div className="pcc-city-stats">
          <div className="pcc-stat" id="pcc-days">
            <CalendarIcon />
            <span>
              {cityData.stats.days > 99 ? "99+" : cityData.stats.days}
            </span>
          </div>
          <div className="pcc-stat" id="pcc-places">
            <LocationIcon />
            <span>
              {cityData.stats.places > 99 ? "99+" : cityData.stats.places}
            </span>
          </div>
          <div className="pcc-stat" id="pcc-meals">
            <FoodieIcon />
            <span>
              {cityData.stats.meals > 99 ? "99+" : cityData.stats.meals}
            </span>
          </div>
          <div className="pcc-stat" id="pcc-logistics">
            <LogisticsIcon />
            <span>
              {cityData.stats.logistics > 99 ? "99+" : cityData.stats.logistics}
            </span>
          </div>
        </div>
        <CircleIcon color={color} />
      </div>
    </NavLink>
  );
}

ProfileCityCard.propTypes = {
  cityData: PropTypes.object,
  color: PropTypes.string
};

export default withRouter(ProfileCityCard);
