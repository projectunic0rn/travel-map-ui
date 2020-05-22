import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";

import BloggerPromptNavMenu from "../BloggerPromptNavMenu";
import BlogPostCard from "../BloggerPopup/BlogPostCard";
import CityIcon from "../../../icons/CityIcon";
import PersonIcon from "../../../icons/PersonIcon";

let userTripTitle = null;

function BloggerCityPopup(props) {
  const [navPosition, handleNavPosition] = useState(0);
  const [cityName, handleCityName] = useState(null);
  const [countryName, handleCountryName] = useState(null);
  const [cityHover, handleCityHover] = useState(true);
  const [blogPosts, handleBlogPosts] = useState([]);
  useEffect(() => {
    if (props.customProps.hoveredCityArray.length < 1) {
      handleCityName(props.customProps.clickedCity.result["text_en-US"]);
      if (props.customProps.cityInfo.result.context !== undefined) {
        for (let i in props.customProps.clickedCity.result.context) {
          if (
            props.customProps.clickedCity.result.context[i].id.slice(0, 7) ===
            "country"
          ) {
            handleCountryName(
              props.customProps.clickedCity.result.context[i]["text_en-US"]
            );
          }
        }
      } else {
        handleCountryName(props.customProps.cityInfo.result.place_name);
      }
    } else {
      handleCityName(props.customProps.hoveredCityArray[0].city);
      handleCountryName(props.customProps.hoveredCityArray[0].country);
    }
  }, [
    // props.customProps.clickedCity.result,
    props.customProps.hoveredCityArray,
  ]);

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
  let filteredBlogPosts = [];
  useEffect(() => {
    let filteredHoveredCityArray = [];
    let blogPostArray = [];
    switch (navPosition) {
      case 0:
        filteredBlogPosts = props.customProps.fakeData
          .sort(sortYear)
          .map((post, i) => {
            if (i === 0) {
              blogPostArray.push(post);
              return (
                <Fragment key={i}>
                  <BlogPostCard post={post} key={i} />
                </Fragment>
              );
            } else if (
              i !== 0 &&
              post.type !== props.customProps.fakeData[i - 1].type
            ) {
              blogPostArray.push(post);
              return (
                <Fragment key={i}>
                  <BlogPostCard
                    post={post}
                    key={i}
                    metric={<CityIcon />}
                    metricValue={post.days}
                  />
                </Fragment>
              );
            } else {
              blogPostArray.push(post);
              return (
                <BlogPostCard
                  post={post}
                  key={i}
                  metric={<CityIcon />}
                  metricValue={post.days}
                />
              );
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
              <BlogPostCard
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
              <BlogPostCard
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
        <div
          className="blogger-popup-info"
          onMouseOver={() => handleCityHover(true)}
          onMouseOut={() => handleCityHover(false)}
        >
          <span className="blog-city">{cityName}</span>
          <span className="blog-country">{countryName}</span>
        </div>
      </div>
      <BloggerPromptNavMenu handleNavPosition={handleNewNavPosition} />
      <div className="friend-trip-container">
        {navPosition !== 0 ? userTripTitle : null}
        {blogPosts.length > 0 ? blogPosts : <div>No blog posts linked yet</div>}
      </div>
    </div>
  );
}

BloggerCityPopup.propTypes = {
  customProps: PropTypes.object,
  handleTripTiming: PropTypes.func,
};

export default BloggerCityPopup;
