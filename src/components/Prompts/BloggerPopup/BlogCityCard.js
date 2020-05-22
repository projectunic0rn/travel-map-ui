import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import BlogPostIcon from "../../../icons/BlogPostIcon";
import BlogPostCard from "./BlogPostCard";

function BlogCityCard(props) {
  const [latestYear, handleLatestYear] = useState(null);
  const [filteredCityData, handleFilteredCityData] = useState(props.cityData);
  const [clicked, handleClicked] = useState(false);

  console.log(props.cityData);
  useEffect(() => {
    handleLatestYear(
      Math.max.apply(
        Math,
        props.cityData.map((o) => {
          return o.year;
        })
      )
    );
  }, []);
  useEffect(() => {
    let newFilteredCityData = [];
    switch (props.navPosition) {
      case 0:
        handleFilteredCityData(props.cityData);
        break;
      case 1:
        newFilteredCityData = props.cityData.filter((post) => {
          return post.type === "single";
        });
        handleFilteredCityData(newFilteredCityData);
        break;
      case 2:
        newFilteredCityData = props.cityData.filter((post) => {
          return post.type === "multi";
        });
        handleFilteredCityData(newFilteredCityData);
        break;
      default:
        break;
    }
    handleClicked(false);
  }, [props.navPosition]);
  return filteredCityData.length > 0 ? (
    <>
      <div
        className="blogger-post-card"
        onClick={() => handleClicked(!clicked)}
      >
        <div className="user-profile-image"></div>
        <div className="utc-user-info-container">
          <span
            className="bcc-post-title"
            style={{ fontSize: "20px", minHeight: "30px" }}
          >
            {props.cityData[0].city}
          </span>
        </div>
        <div className="bcc-data-container">
          <span className="bcc-city-posts" style={{ flexDirection: "row" }}>
            {filteredCityData.length}
            <BlogPostIcon />
          </span>
        </div>
        <div
          className={
            "utc-year-container utc-year-container-" +
            props.cityData[0].tripTiming
          }
        >
          <p className="utc-year">{latestYear}</p>
        </div>
      </div>
      {clicked
        ? filteredCityData.map((post, i) => {
            return <BlogPostCard post={post} key={i} />;
          })
        : null}
    </>
  ) : null;
}

BlogCityCard.propTypes = {
  cityData: PropTypes.array,
  navPosition: PropTypes.number,
};

export default BlogCityCard;
