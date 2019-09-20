import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InterestIcon from "../../../../icons/InterestIcon";
import UserAvatar from "../../../../components/UserAvatar/UserAvatar";

function FriendCard({ friend, currentFriend }) {
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
        <span className="fc-user-avatar">
          <UserAvatar />
        </span>
        <div className="fc-user-details">
          <span className="fc-username">{friend.username}</span>
          <span className="fc-user-location">
            {friend.Place_living.city + ", " + friend.Place_living.countryISO}
          </span>
        </div>
        <div className="fc-user-interests">
          {friend.interests.map(interest => (
            <span key={interest}>
              <InterestIcon icon={interest} />
            </span>
          ))}
        </div>
      </div>
      <div className="fc-user-metrics">
        <span className="fc-user-metric">
          <span className="fc-user-metric-value">12</span>
          <span className="fc-user-metric-type">friends</span>
        </span>
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
      </div>

      <div className = 'fc-button-container'>
      {currentFriend ? <span className = 'fc-see-profile'>See Profile</span> : 
        <><span className = 'fc-accept'>Accept</span>
        <span className = 'fc-deny'>Deny</span></>}
      </div>
    </div>
  );
}

FriendCard.propTypes = {
  friend: PropTypes.object, 
  currentFriend: PropTypes.bool
};

export default FriendCard;
