import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import PersonIcon from "../../../icons/PersonIcon";
import BlogUserCard from "../BloggerPopup/BlogUserCard";

function BloggerCityPopup(props) {
  const [cityName] = useState(props.customProps.clickedCity.city);
  const [countryName] = useState(props.customProps.clickedCity.country);
  const [bloggerCards, handleBloggerCards] = useState([]);

  useEffect(() => {
    let uniqueArray = props.customProps.uniqueBloggerArray;
    let bloggerNames = [];
    let newUniqueArray = [];
    for (let i = 0; i <= props.customProps.uniqueBloggerArray.length - 1; i++) {
      if (bloggerNames.indexOf(uniqueArray[i].username) === -1) {
        newUniqueArray.push({
          country: uniqueArray[i].country,
          city: 1,
          username: uniqueArray[i].username,
          id: uniqueArray[i].id,
          avatarIndex: uniqueArray[i].avatarIndex,
          color: uniqueArray[i].color,
          email: uniqueArray[i].email,
        });
        bloggerNames.push(uniqueArray[i].username);
      } else {
        const result = newUniqueArray.findIndex(
          (country) => country.username === uniqueArray[i].username
        );
        newUniqueArray[result].city++;
      }
    }
    newUniqueArray.sort((countryA, countryB) => {
      return countryB.city - countryA.city;
    });
    let cityBloggerCards = newUniqueArray.map((city) => {
      return <BlogUserCard cityData={city} key={city.id} cityName={cityName} />;
    });
    handleBloggerCards(cityBloggerCards);
  }, [props.customProps.uniqueBloggerArray]);

  return (
    <div className="blogger-popup-container">
      <div className="clicked-country-header">
        <div className="clicked-country-info-value">
          {props.customProps.uniqueBloggers} /{" "}
          {props.customProps.activeBlogger === null ? 15 : 1}
          <PersonIcon />
        </div>
      </div>
      <div className="clicked-country-info">
        <div className="blogger-popup-info">
          <span className="blog-city">
            {cityName === undefined ? countryName : cityName}
          </span>
          <span className="blog-country">
            {cityName === undefined ? "" : countryName}
          </span>
        </div>
      </div>
      <div className="friend-trip-container">
        {bloggerCards.length > 0 ? (
          bloggerCards
        ) : (
          <div>No visitors linked yet</div>
        )}
      </div>
    </div>
  );
}

BloggerCityPopup.propTypes = {
  customProps: PropTypes.object,
  handleTripTiming: PropTypes.func,
};

export default BloggerCityPopup;
