import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InterestIcon from "../../../../icons/InterestIcon";

function FriendCard({ friend }) {
  const [cityArray, handleCityArray] = useState([]);
  const [countryArray, handleCountryArray] = useState([]);
  useEffect(() => {
    let cityArray = [0];
    let countryArray = [0];
    if (friend.Places_visited !== null) {
      friend.Places_visited.forEach(tripType => {
        if (cityArray.indexOf(tripType.cityId) === -1) {
          cityArray.push(tripType.cityId);
        }
        if (countryArray.indexOf(tripType.countryId) === -1) {
          countryArray.push(tripType.countryId);
        }
      });
    }
    if (friend.Places_visiting !== null) {
      friend.Places_visiting.forEach(tripType => {
        if (cityArray.indexOf(tripType.cityId) === -1) {
          cityArray.push(tripType.cityId);
        }
        if (countryArray.indexOf(tripType.countryId) === -1) {
          countryArray.push(tripType.countryId);
        }
      });
    }
    if (friend.Place_living !== null) {
      if (cityArray.indexOf(friend.Place_living) === -1) {
        cityArray.push(friend.Place_living.cityId);
      }
      if (countryArray.indexOf(friend.Place_living.countryId) === -1) {
        countryArray.push(friend.Place_living.countryId);
      }
    }
    handleCityArray(cityArray);
    handleCountryArray(countryArray);
  }, [friend]);
  return (
    <div className="friend-card">
      <div className="fc-user-info">
        <span className="fc-user-avatar"></span>
        <span className="fc-username">{friend.username}</span>
        <span className="fc-user-location">
          {friend.Place_living.city + ", " + friend.Place_living.countryISO}
        </span>
        <div className="fc-user-interests">
          {friend.interests.map(interest => (
            <span key = {interest}>
              <InterestIcon  icon={interest} />
            </span>
          ))}
        </div>
      </div>
      <div className="fc-user-metrics">
        <span className="fc-user-metric">
          <span className="fc-user-metric-value">
            {countryArray.length - 1}
          </span>
          <span className="fc-user-metric-type">countries</span>
        </span>
        <span className="fc-user-metric">
          <span className="fc-user-metric-value">{cityArray.length - 1}</span>
          <span className="fc-user-metric-type">cities</span>
        </span>
        <span className="fc-user-metric">
          <span className="fc-user-metric-value">12</span>
          <span className="fc-user-metric-type">friends</span>
        </span>
      </div>
    </div>
  );
}

FriendCard.propTypes = {
  friend: PropTypes.object
};

export default FriendCard;
