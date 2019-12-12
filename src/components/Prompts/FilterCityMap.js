import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { GET_ALL_FRIEND_INFO } from "../../GraphQL";
import Loader from "../../components/common/Loader/Loader";

function FilterCityMap() {
  const [interestTagArray, handleInterestTag] = useState([]);
  function handleInterestTagHelper(tag) {
    let newInterestTagArray = interestTagArray;
    newInterestTagArray.push(tag);
    handleInterestTag(newInterestTagArray);
  }
  return (
    <Query
      query={GET_ALL_FRIEND_INFO}
      notifyOnNetworkStatusChange
      fetchPolicy={"cache-and-network"}
      partialRefetch={true}
    >
      {({ loading, error, data, refetch }) => {
        if (loading) return <Loader />;
        if (error) return `Error! ${error}`;
        return (
          <div className="clicked-country-container filter-city-container">
            <div className="clicked-country-header">Add filters</div>
            <div className="filter-city-users">
              <input type="text" placeholder="Add a user name"></input>
            </div>
            <div className="filter-city-interest-tags">
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
            </div>
            <div className="filter-city-buttons">
              <span className="button large">Apply</span>
              <span className="button large">Clear</span>
            </div>
          </div>
        );
      }}
    </Query>
  );
}

FilterCityMap.propTypes = {};

export default FilterCityMap;
