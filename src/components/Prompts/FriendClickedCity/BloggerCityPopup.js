import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Query } from "react-apollo";
import { GET_BLOG_POSTS_FROM_CITY } from "../../../GraphQL";

import BloggerPromptNavMenu from "../BloggerPromptNavMenu";
import BlogPostCard from "../BloggerPopup/BlogPostCard";
import CityIcon from "../../../icons/CityIcon";
import PersonIcon from "../../../icons/PersonIcon";
import BlogUserCard from "../BloggerPopup/BlogUserCard";
import Loader from "../../common/SimpleLoader/SimpleLoader";

let userTripTitle = null;

function BloggerCityPopup(props) {
  const [multiUsernames] = useState([
    { username: "WanderingEarl" },
    { username: "AdventurousKate" },
    { username: "UncorneredMarket" },
    { username: "NeverendingFootsteps" },
    { username: "NomadicMatt" },
    { username: "TheBlondeAbroad" },
    { username: "BucketListly" },
    { username: "iameileen" },
    { username: "Bemytravelmuse" },
    { username: "fake" },
    // { username: "TheBrokeBackpacker" },
    // { username: "ThePlanetD" },
  ]);
  const [loaded, handleLoaded] = useState(false);
  const [cityId, handleCityId] = useState(
    props.customProps.hoveredCityArray[0].cityId
  );
  const [navPosition, handleNavPosition] = useState(0);
  const [cityName, handleCityName] = useState(null);
  const [countryName, handleCountryName] = useState(null);
  const [cityHover, handleCityHover] = useState(true);
  const [blogPostCards, handleBlogPostCards] = useState([]);
  const [blogPosts, handleBlogPosts] = useState([]);
  const [countryPostArray, handleCountryPostArray] = useState([]);
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
  }, [props.customProps.hoveredCityArray]);

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
        filteredBlogPosts = blogPosts.sort(sortYear).map((post, i) => {
          if (i === 0) {
            blogPostArray.push(post);
            return (
              <Fragment key={i}>
                <BlogPostCard post={post} key={i} />
              </Fragment>
            );
          } else if (i !== 0 && post.type !== blogPosts[i - 1].type) {
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
        filteredHoveredCityArray = blogPosts.filter((post) => {
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
        filteredHoveredCityArray = blogPosts.filter((post) => {
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
    handleBlogPostCards(filteredBlogPosts);
  }, [navPosition, blogPosts]);

  useEffect(() => {
    let newBlogPostArray = [];
    filteredBlogPosts = Object.entries(countryPostArray)
      .sort()
      .map((city, i) => {
        if (i === 0) {
          newBlogPostArray.push(city[1]);
          return (
            <Fragment key={i}>
              <BlogUserCard
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
              <BlogUserCard
                cityData={city[1]}
                key={i}
                navPosition={navPosition}
              />
            </Fragment>
          );
        } else {
          newBlogPostArray.push(city[1]);
          return (
            <BlogUserCard
              cityData={city[1]}
              key={i}
              navPosition={navPosition}
            />
          );
        }
      });
    filteredBlogPosts.sort(
      (a, b) =>
        b.props.children.props.cityData[0].year -
        a.props.children.props.cityData[0].year
    );
    handleBlogPostCards(filteredBlogPosts);
  }, [navPosition, blogPosts]);

  function handleNewNavPosition(position) {
    handleNavPosition(position);
  }

  function handleBlogPostHelper(data) {
    console.log(data)
    let newBlogPosts = [];
    let newBlogPost = {};
    for (let i in data) {
      for (let j in data[i].Places_visited) {
        for (let k in data[i].Places_visited[j].BlogPosts) {
          if (data[i].Places_visited[j].BlogPosts.length >= 1) {
            newBlogPost = {
              username: data[i].username,
              email: data[i].email,
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
          }
          newBlogPosts.push(newBlogPost);
        }
        if (data[i].Places_visited[j].BlogPosts.length < 1) {
          newBlogPost = {
            username: data[i].username,
            email: data[i].email,
            avatarIndex: data[i].avatarIndex,
            color: data[i].color,
            city: data[i].Places_visited[j].city,
            cityId: data[i].Places_visited[j].cityId,
            country: data[i].Places_visited[j].country,
            countryId: data[i].Places_visited[j].countryId,
            year: null,
            tripTiming: 0,
            url: null,
            title: null,
            type: null,
          };
          newBlogPosts.push(newBlogPost);
        }
      }
    }
    let filteredPosts = [];
    if (props.customProps.activeBlogger !== null) {
      filteredPosts = newBlogPosts.filter(
        (post) =>
          post.username ===
          multiUsernames[props.customProps.activeBlogger].username
      );
    } else {
      filteredPosts = newBlogPosts;
    }
    const groupedCities = _.mapValues(
      _.groupBy(filteredPosts, (post) => post.username),
      (v) => _.sortBy(v, (v) => v.year * -1)
    );
    handleCountryPostArray(groupedCities);
    handleBlogPosts(filteredPosts);
    handleLoaded(true);
  }
  return (
    <Query
      query={GET_BLOG_POSTS_FROM_CITY}
      variables={{ multiUsernames, cityId }}
      notifyOnNetworkStatusChange
      fetchPolicy={"network-only"}
      onCompleted={(data) => {
        console.log(data);
        handleBlogPostHelper(data.getPostsFromCity);
      }}
    >
      {({ loading, error }) => {
        if (loading)
          return (
            <div className="blog-popup-loader">
              <Loader />
            </div>
          );
        if (!loaded)
          return (
            <div className="blog-popup-loader">
              <Loader />
            </div>
          );
        if (error) return `Error! ${error}`;
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
              {blogPostCards.length > 0 ? (
                blogPostCards
              ) : (
                <div>No blog posts linked yet</div>
              )}
            </div>
          </div>
        );
      }}
    </Query>
  );
}

BloggerCityPopup.propTypes = {
  customProps: PropTypes.object,
  handleTripTiming: PropTypes.func,
};

export default BloggerCityPopup;
