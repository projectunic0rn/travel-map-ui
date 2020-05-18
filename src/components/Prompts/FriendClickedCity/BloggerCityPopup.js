import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";

import BloggerPromptNavMenu from "../BloggerPromptNavMenu";
import BlogPostCard from "../BloggerPopup/BlogPostCard";
import CityIcon from "../../../icons/CityIcon";

const userVisitTimings = ["SINGLE CITY", "MULTI CITY"];
function BloggerCityPopup(props) {
  console.log(props)
  const [navPosition, handleNavPosition] = useState(0);
  const [cityName, handleCityName] = useState(null);
  const [countryName, handleCountryName] = useState(null);
  const [friendsWithTrips, handleFriendsWithTrips] = useState(0);
  const [cityHover, handleCityHover] = useState(true);
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
      // let uniqueFriends = props.customProps.hoveredCityArray
      //   .map((trip) => trip.username)
      //   .filter((value, index, self) => self.indexOf(value) === index);
      // handleFriendsWithTrips(uniqueFriends);
    }
  }, [
    // props.customProps.clickedCity.result,
    props.customProps.hoveredCityArray,
  ]);


function sortYear(a, b) {
  const yearA = a.year;
  const yearB = b.year

  let comparison = 0;
  if (yearA > yearB) {
    comparison = 1;
  } else if (yearA < yearB) {
    comparison = -1;
  }
  return comparison;
}

  let filteredHoveredCityArray = [];
  let friendTrips = null;
  let userTripTitle = null;
  switch (navPosition) {
    case 0:
      friendTrips = props.customProps.fakeData.sort(sortYear).map((post, i) => {
        if (i === 0) {
          return (
            <Fragment key={i}>
              <BlogPostCard post={post} key={i} />
            </Fragment>
          );
        } else if (i !== 0 && post.type !== props.customProps.fakeData[i - 1].type) {
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
      friendTrips = filteredHoveredCityArray.sort(sortYear).map((post, i) => {
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
      friendTrips = filteredHoveredCityArray.sort(sortYear).map((post, i) => {
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

  function handleNewNavPosition(position) {
    handleNavPosition(position);
  }
  return (
    <div className="blogger-popup-container">
      <div className="clicked-country-header">
        <div className="clicked-country-info-value"></div>
      </div>
      <div className="clicked-country-info">
        <div
          className="blogger-popup-info"
          onMouseOver={() => handleCityHover(true)}
          onMouseOut={() => handleCityHover(false)}
        >
          <span className = 'blog-city'>{cityName}</span>
          <span className = 'blog-country'>{countryName}</span>
        </div>
      </div>
      <BloggerPromptNavMenu handleNavPosition={handleNewNavPosition} />
      <div className="friend-trip-container">
        {userTripTitle}
        {friendTrips}
      </div>
    </div>
  );
}

BloggerCityPopup.propTypes = {
  customProps: PropTypes.object,
  handleTripTiming: PropTypes.func,
};

export default BloggerCityPopup;
