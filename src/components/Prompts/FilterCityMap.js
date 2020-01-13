import React, { useState } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { GET_ALL_FRIEND_INFO } from "../../GraphQL";
import Loader from "../common/Loader/Loader";
import DoNotRecommendIcon from "../../icons/DoNotRecommendIcon";

function FilterCityMap(props) {
  const [usernameArray, handleUsernameChange] = useState(
    props.customProps.filterSettings.username !== undefined
      ? props.customProps.filterSettings.username
      : []
  );
  const [interestTagArray, handleInterestTag] = useState([]);
  const [friendDetails, handleFriendDetails] = useState([]);

  function handleUsernameChangeHelper(e) {
    if (e.key === "Enter" || e.key === "Unidentified") {
      let newUsernameArray = [...usernameArray];
      if (newUsernameArray.indexOf(e.target.value) === -1) {
        newUsernameArray.push(e.target.value);
      } else {
        newUsernameArray.splice(newUsernameArray.indexOf(e.target.value), 1);
      }
      handleUsernameChange(newUsernameArray);
      document.getElementById("filter-city-users-input").value = "";
    }
    return;
  }
  function deleteUsername(username) {
    let newUsernameArray = [...usernameArray];
    newUsernameArray.splice(newUsernameArray.indexOf(username), 1);
    handleUsernameChange(newUsernameArray);
  }
  function handleInterestTagHelper(tag) {
    let newInterestTagArray = interestTagArray;
    newInterestTagArray.push(tag);
    handleInterestTag(newInterestTagArray);
  }
  function handleApplyFilter() {
    props.customProps.handleFilter({
      username: usernameArray
    });
    props.customProps.closePopup();
  }
  function handleFilterCleared() {
    props.customProps.handleFilterCleared();
    props.customProps.closePopup();
  }
  return (
    <Query
      query={GET_ALL_FRIEND_INFO}
      notifyOnNetworkStatusChange
      // fetchPolicy={"cache-and-network"}
      partialRefetch={true}
    >
      {({ loading, error, data }) => {
        if (loading) return <Loader />;
        if (error) return `Error! ${error}`;
        handleFriendDetails(data.users);
        return (
          <div className="clicked-country-container filter-city-container">
            <div className="clicked-country-header">Add filters</div>
            <div className="filter-city-users">
              <input
                type="text"
                id="filter-city-users-input"
                placeholder="Add a user name"
                list="user-choice"
                name="user-search"
                onKeyUp={e => handleUsernameChangeHelper(e)}
              ></input>
              <datalist name="user-choice" id="user-choice">
                {friendDetails.map(friend => (
                  <option key={friend.id} value={friend.username}>
                    {friend.username}
                  </option>
                ))}
              </datalist>
              <div className="filter-city-users-results">
                {usernameArray.map(user => (
                  <span key={user}>
                    {user}
                    <DoNotRecommendIcon onClick={() => deleteUsername(user)} />
                  </span>
                ))}
              </div>
            </div>
            {/* <div className="filter-city-interest-tags">
              <select
                defaultValue="interest tag"
                onChange={e => handleInterestTagHelper(e.target.value)}
              >
                <option key="placeholder" value="add an interest tag">
                  add an interest tag
                </option>
                <option key="foodie" value="foodie">
                  foodie
                </option>
                <option key="like a local" value="like a local">
                  like a local
                </option>
                <option key="nature lover" value="nature lover">
                  nature lover
                </option>
                <option key="history buff" value="history buff">
                  history buff
                </option>
                <option key="shopaholic" value="shopaholic">
                  shopaholic
                </option>
                <option key="photographer" value="photographer">
                  photographer
                </option>
                <option key="relaxer" value="relaxer">
                  relaxer
                </option>
                <option key="adventurer" value="adventurer">
                  adventurer
                </option>
                <option key="frugal" value="frugal">
                  frugal
                </option>
                <option key="party animal" value="party animal">
                  party animal
                </option>
                <option key="art connoisseur" value="art connoisseur">
                  art connoisseur
                </option>
                <option key="guided tourist" value="guided tourist">
                  guided tourist
                </option>
                <option key="luxurious" value="luxurious">
                  luxurious
                </option>
                <option key="road less traveled" value="road less traveled">
                  road less traveled
                </option>
                <option key="socialite" value="socialite">
                  socialite
                </option>
              </select>
            </div> */}
            <div className="filter-city-buttons">
              <span className="button" onClick={handleApplyFilter}>
                Apply
              </span>
              <span
                className="button"
                onClick={handleFilterCleared}
              >
                Clear
              </span>
            </div>
          </div>
        );
      }}
    </Query>
  );
}

FilterCityMap.propTypes = {
  customProps: PropTypes.object
};

export default FilterCityMap;
