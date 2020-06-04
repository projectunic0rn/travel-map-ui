import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import BlogPostIcon from "../../../icons/BlogPostIcon";
import BlogPostCard from "./BlogPostCard";
import UserAvatar from "../../UserAvatar/UserAvatar";

function BlogUserCard(props) {
  const [latestYear, handleLatestYear] = useState(null);
  const [filteredCityData, handleFilteredCityData] = useState(props.cityData);
  const [clicked, handleClicked] = useState(false);
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
        <div className="user-profile-image">
          <UserAvatar
            avatarIndex={
              props.cityData[0].avatarIndex !== null
                ? props.cityData[0].avatarIndex
                : 1
            }
            color={props.cityData[0].color}
          />
        </div>
        <div className="utc-user-info-container">
          <span
            className="buc-post-title"
            style={{ fontSize: "20px", minHeight: "30px" }}
          >
            {props.cityData[0].username}
          </span>
        </div>
        <div className="bcc-data-container">
          <span className="bcc-city-posts" style={{ flexDirection: "row" }}>
            {filteredCityData[0].title !== null ? filteredCityData.length : 0}
            <BlogPostIcon />
          </span>
        </div>
        <div
          className={
            "utc-year-container utc-year-container-" +
            props.cityData[0].tripTiming
          }
        >
          <p className="utc-year">{latestYear !== 0 ? latestYear : ""}</p>
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

BlogUserCard.propTypes = {
  cityData: PropTypes.array,
  navPosition: PropTypes.number,
};

export default BlogUserCard;
