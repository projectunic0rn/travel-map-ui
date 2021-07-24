import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import CityIcon from "../../../icons/CityIcon";
import UserAvatar from "../../UserAvatar/UserAvatar";

function BlogUserCard(props) {
  const [, handleFilteredCityData] = useState(props.cityData);
  const [clicked, handleClicked] = useState(false);
  const [url, handleBloggerUrl] = useState("");

  useEffect(() => {
    let bloggerUrlPrefix = "";
    let bloggerUrlSuffix = "";
    switch (props.cityData.username) {
      case "BucketListly":
        bloggerUrlPrefix = "https://www.bucketlistly.blog/search?query=";
        bloggerUrlSuffix =
          props.cityName === undefined
            ? props.cityData.country
            : props.cityData.city;
        break;
      case "WanderingEarl":
        bloggerUrlPrefix = "https://www.wanderingearl.com/?s=";
        bloggerUrlSuffix =
          props.cityName === undefined
            ? props.cityData.country
            : props.cityData.city;
        break;
      case "AdventurousKate":
        bloggerUrlPrefix = "https://www.adventurouskate.com/?s=";
        bloggerUrlSuffix =
          props.cityName === undefined
            ? props.cityData.country
            : props.cityData.city;
        break;
      case "Nomadasaurus":
        bloggerUrlPrefix = "https://www.nomadasaurus.com/?s=";
        bloggerUrlSuffix =
          props.cityName === undefined
            ? props.cityData.country
            : props.cityData.city;
        break;
      case "iameileen":
        bloggerUrlPrefix = "https://iamaileen.com/?s=";
        bloggerUrlSuffix =
          props.cityName === undefined
            ? props.cityData.country
            : props.cityData.city;
        break;
      case "Bemytravelmuse":
        bloggerUrlPrefix = "https://www.bemytravelmuse.com/?s=";
        bloggerUrlSuffix =
          props.cityName === undefined
            ? props.cityData.country
            : props.cityData.city;
        break;
      case "heydipyourtoesin":
        bloggerUrlPrefix = "https://heydipyourtoesin.com/?s=";
        bloggerUrlSuffix =
          props.cityName === undefined
            ? props.cityData.country
            : props.cityData.city;
        break;
      case "AlexinWanderland":
        bloggerUrlPrefix = "https://www.alexinwanderland.com/?s=";
        bloggerUrlSuffix =
          props.cityName === undefined
            ? props.cityData.country
            : props.cityData.city;
        break;
      case "TheBlondeAbroad":
        bloggerUrlPrefix = "https://www.theblondeabroad.com/?s=";
        bloggerUrlSuffix =
          props.cityName === undefined
            ? props.cityData.country
            : props.cityData.city;
        break;
      case "WildJunket":
        bloggerUrlPrefix = "https://www.wildjunket.com/?s=";
        bloggerUrlSuffix =
          props.cityName === undefined
            ? props.cityData.country
            : props.cityData.city;
        break;
      case "NomadicMatt":
        bloggerUrlPrefix = "https://www.nomadicmatt.com/?s=";
        bloggerUrlSuffix =
          props.cityName === undefined
            ? props.cityData.country
            : props.cityData.city;
        break;
      case "UncorneredMarket":
        bloggerUrlPrefix = "https://uncorneredmarket.com/?s=";
        bloggerUrlSuffix =
          props.cityName === undefined
            ? props.cityData.country
            : props.cityData.city;
        break;
      case "TheBrokeBackpacker":
        bloggerUrlPrefix = "https://www.thebrokebackpacker.com/?s=";
        bloggerUrlSuffix =
          props.cityName === undefined
            ? props.cityData.country
            : props.cityData.city;
        break;
      case "NeverendingFootsteps":
        bloggerUrlPrefix = "https://www.neverendingfootsteps.com/?s=";
        bloggerUrlSuffix =
          props.cityName === undefined
            ? props.cityData.country
            : props.cityData.city;
        break;
        case "NomadicChica":
          bloggerUrlPrefix = "https://www.nomadicchica.com/?s=";
          bloggerUrlSuffix =
            props.cityName === undefined
              ? props.cityData.country
              : props.cityData.city;
          break;
      default:
        break;
    }
    handleBloggerUrl(bloggerUrlPrefix + bloggerUrlSuffix);
  }, [props.cityData]);

  useEffect(() => {
    handleFilteredCityData(props.cityData);
  }, [props.cityData]);

  return (
    <>
      {" "}
      <a href={url} target="_blank" rel="noopener noreferrer">
        <div
          className="blogger-post-card"
          onClick={() => handleClicked(!clicked)}
        >
          <div className="user-profile-image">
            <UserAvatar
              avatarIndex={
                props.cityData.avatarIndex !== null
                  ? props.cityData.avatarIndex
                  : 1
              }
              color={props.cityData.color}
              email={props.cityData.email}
            />
          </div>
          <div className="utc-user-info-container">
            <span
              className="buc-post-title"
              style={{ fontSize: "20px", minHeight: "30px" }}
            >
              {props.cityData.username}
            </span>
          </div>
          <div className="bcc-data-container">
            <span className="bcc-city-posts" style={{ flexDirection: "row" }}>
              { props.cityData.city} <CityIcon />
            </span>
          </div>
        </div>
      </a>
    </>
  );
}

BlogUserCard.propTypes = {
  cityData: PropTypes.object,
  navPosition: PropTypes.number,
  cityName: PropTypes.string,
};

export default BlogUserCard;
