import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";

import BloggerPromptNavMenu from "../BloggerPromptNavMenu";
import BlogCityCard from "../BloggerPopup/BlogCityCard";

function BloggerCountryPopup(props) {
  const [navPosition, handleNavPosition] = useState(0);
  const [blogPosts, handleBlogPosts] = useState([]);

  let userTripTitle = null;
  let filteredBlogPosts = [];
  useEffect(() => {
    let newBlogPostArray = [];

    filteredBlogPosts = Object.entries(props.customProps.cityPostArray).map(
      (city, i) => {
        if (i === 0) {
          newBlogPostArray.push(city[1]);
          return (
            <Fragment key={i}>
              <BlogCityCard
                cityData={city[1]}
                key={i}
                navPosition={navPosition}
              />
            </Fragment>
          );
        } else if (
          i !== 0 &&
          city.type !== props.customProps.fakeData[i - 1].type
        ) {
          newBlogPostArray.push(city[1]);
          return (
            <Fragment key={i}>
              <BlogCityCard
                cityData={city[1]}
                key={i}
                navPosition={navPosition}
              />
            </Fragment>
          );
        } else {
          newBlogPostArray.push(city[1]);
          return (
            <BlogCityCard
              cityData={city[1]}
              key={i}
              navPosition={navPosition}
            />
          );
        }
      }
    );

    handleBlogPosts(filteredBlogPosts);
  }, [navPosition]);

  function handleNewNavPosition(position) {
    handleNavPosition(position);
  }
  return (
    <div className="blogger-popup-container">
      <div className="clicked-country-header">
        <div className="clicked-country-info-value"></div>
      </div>
      <div className="clicked-country-info">
        <div className="blogger-popup-info">
          <span className="blog-country">{props.customProps.countryName}</span>
        </div>
      </div>
      <BloggerPromptNavMenu handleNavPosition={handleNewNavPosition} />
      <div className="friend-trip-container">
        {navPosition !== 0 ? (
          navPosition === 2 ? (
            <div className="user-trip-title">MULTI CITY</div>
          ) : (
            <div className="user-trip-title">SINGLE CITY</div>
          )
        ) : null}
        {blogPosts.length > 0 ? (
          blogPosts
        ) : (
          <div>No cities with blog posts linked yet</div>
        )}
      </div>
    </div>
  );
}

BloggerCountryPopup.propTypes = {
  customProps: PropTypes.object,
  handleTripTiming: PropTypes.func,
};

export default BloggerCountryPopup;
