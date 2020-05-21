import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import BloggerPromptNavMenu from "../BloggerPromptNavMenu";
import BlogCityCard from "../BloggerPopup/BlogCityCard";
import CityIcon from "../../../icons/CityIcon";
import PersonIcon from "../../../icons/PersonIcon";

function BloggerCountryPopup(props) {
  const [navPosition, handleNavPosition] = useState(0);
  const [cityHover, handleCityHover] = useState(true);
  const [uniqueBloggers, handleUniqueBloggers] = useState(0);
  const [blogPosts, handleBlogPosts] = useState([]);
  const [cityPostArray, handleCityPostArray] = useState([]);

  useEffect(() => {

  }, []);

  function sortYear(a, b) {
    const yearA = a.year;
    const yearB = b.year;

    let comparison = 0;
    if (yearA < yearB) {
      comparison = 1;
    } else if (yearA > yearB) {
      comparison = -1;
    }
    return comparison;
  }
  let userTripTitle = null;
  let filteredBlogPosts = [];
  useEffect(() => {
    let filteredHoveredCityArray = [];
    let blogPostArray = [];
    console.log(Object.entries(props.customProps.cityPostArray))
    switch (navPosition) {
      case 0:
        filteredBlogPosts = Object.entries(props.customProps.cityPostArray).map((city, i) => {
          if (i === 0) {
            blogPostArray.push(city[1]);
            return (
              <Fragment key={i}>
                <BlogCityCard cityData={city[1]} key={i} />
              </Fragment>
            );
          } else if (
            i !== 0 &&
            city.type !== props.customProps.fakeData[i - 1].type
          ) {
            blogPostArray.push(city[1]);
            return (
              <Fragment key={i}>
                <BlogCityCard cityData={city[1]} key={i} />
              </Fragment>
            );
          } else {
            blogPostArray.push(city[1]);
            return <BlogCityCard cityData={city[1]} key={i} />;
          }
        });
        break;
      case 1:
        filteredHoveredCityArray = props.customProps.fakeData.filter((post) => {
          return post.type === "single";
        });
        userTripTitle = <div className="user-trip-title">SINGLE CITY</div>;
        filteredBlogPosts = filteredHoveredCityArray
          .sort(sortYear)
          .map((post, i) => {
            return (
              <BlogCityCard
                post={post}
                key={i}
                metric={<CityIcon />}
                metricValue={0}
              />
            );
          });
        break;
      case 2:
        filteredHoveredCityArray = props.customProps.fakeData.filter((post) => {
          return post.type === "multi";
        });
        userTripTitle = <div className="user-trip-title">MULTI CITY</div>;
        filteredBlogPosts = filteredHoveredCityArray
          .sort(sortYear)
          .map((post, i) => {
            return (
              <BlogCityCard
                post={post}
                key={i}
                metric={<CityIcon />}
                metricValue={0}
              />
            );
          });
        break;
      default:
        break;
    }
    console.log(filteredBlogPosts)
    handleBlogPosts(filteredBlogPosts);
  }, [navPosition]);

  function handleNewNavPosition(position) {
    handleNavPosition(position);
  }
  return (
    <div className="blogger-popup-container">
      <div className="clicked-country-header">
        <div className="clicked-country-info-value">
          {props.customProps.uniqueBloggers} /{" "}
          {props.customProps.activeBlogger === null ? 11 : 1}
          <PersonIcon />
        </div>
      </div>
      <div className="clicked-country-info">
        <div className="blogger-popup-info">
          <span className="blog-country">{props.customProps.countryName}</span>
        </div>
      </div>
      <BloggerPromptNavMenu handleNavPosition={handleNewNavPosition} />
      <div className="friend-trip-container">
        {userTripTitle}
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
