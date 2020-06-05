import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Query } from "react-apollo";
import { GET_BLOG_POSTS_FROM_COUNTRY } from "../../../GraphQL";

import BloggerPromptNavMenu from "../BloggerPromptNavMenu";
import BlogCityCard from "../BloggerPopup/BlogCityCard";
import Loader from "../../common/SimpleLoader/SimpleLoader";

function BloggerCountryPopup(props) {
  const [multiUsernames] = useState([
    { username: "NomadicMatt" },
    { username: "AdventurousKate" },
    { username: "Bemytravelmuse" },
    { username: "iameileen" },
    { username: "WanderingEarl" },
    { username: "TheBlondeAbroad" },
    { username: "NeverendingFootsteps" },
    { username: "UncorneredMarket" },
    // { username: "TheBrokeBackpacker" },
    // { username: "ThePlanetD" },
    { username: "BucketListly" },
  ]);
  const [country, handleCountryname] = useState(props.customProps.countryName);
  const [navPosition, handleNavPosition] = useState(0);
  const [blogPostCards, handleBlogPostCards] = useState([]);
  const [blogPosts, handleBlogPosts] = useState([]);
  const [cityPostArray, handleCityPostArray] = useState([]);

  let userTripTitle = null;
  let filteredBlogPosts = [];
  useEffect(() => {
    let newBlogPostArray = [];

    filteredBlogPosts = Object.entries(cityPostArray).map((city, i) => {
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
      } else if (i !== 0 && city.type !== "multi") {
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
          <BlogCityCard cityData={city[1]} key={i} navPosition={navPosition} />
        );
      }
    });

    handleBlogPostCards(filteredBlogPosts);
  }, [navPosition, blogPosts]);

  function handleNewNavPosition(position) {
    handleNavPosition(position);
  }

  function handleBlogPostHelper(data) {
    let newBlogPosts = [];
    for (let i in data) {
      for (let j in data[i].Places_visited) {
        for (let k in data[i].Places_visited[j].BlogPosts) {
          let newBlogPost = {
            username: data[i].username,
            avatarIndex: data[i].avatarIndex,
            color: data[i].color,
            city: data[i].Places_visited[j].city,
            cityId: data[i].Places_visited[j].cityId,
            country: data[i].Places_visited[j].country,
            countryId: data[i].Places_visited[j].countryId,
            year: data[i].Places_visited[j].BlogPosts[k].year,
            tripTiming: 0,
            url: data[i].Places_visited[j].BlogPosts[k].url,
            title: data[i].Places_visited[j].BlogPosts[k].name,
            type: data[i].Places_visited[j].BlogPosts[k].type,
          };
          newBlogPosts.push(newBlogPost);
        }
      }
    }
    const groupedCities = _.groupBy(newBlogPosts, (post) => post.cityId);
    handleCityPostArray(groupedCities);
    handleBlogPosts(newBlogPosts);
  }
  return (
    <Query
      query={GET_BLOG_POSTS_FROM_COUNTRY}
      variables={{ multiUsernames, country }}
      notifyOnNetworkStatusChange
      fetchPolicy={"network-only"}
      onCompleted={(data) => handleBlogPostHelper(data.getPostsFromCountry)}
    >
      {({ loading, error }) => {
        if (loading)
          return (
            <div className="blog-popup-loader">
              <Loader />
            </div>
          );
        if (error) return `Error! ${error}`;
        return (
          <div className="blogger-popup-container">
            <div className="clicked-country-header">
              <div className="clicked-country-info-value"></div>
            </div>
            <div className="clicked-country-info">
              <div className="blogger-popup-info">
                <span className="blog-country">
                  {props.customProps.countryName}
                </span>
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
              {blogPostCards.length > 0 ? (
                blogPostCards
              ) : (
                <div>No cities with blog posts linked yet</div>
              )}
            </div>
          </div>
        );
      }}
    </Query>
  );
}

BloggerCountryPopup.propTypes = {
  customProps: PropTypes.object,
  handleTripTiming: PropTypes.func,
};

export default BloggerCountryPopup;
