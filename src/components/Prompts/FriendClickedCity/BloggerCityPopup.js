import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { GET_BLOG_POSTS_FROM_CITY } from "../../../GraphQL";

import BloggerPromptNavMenu from "../BloggerPromptNavMenu";
import BlogPostCard from "../BloggerPopup/BlogPostCard";
import CityIcon from "../../../icons/CityIcon";
import PersonIcon from "../../../icons/PersonIcon";
import Loader from "../../common/Loader/Loader";

let userTripTitle = null;

function BloggerCityPopup(props) {
  const [multiUsernames] = useState([
    { username: "NomadicMatt" },
    { username: "AdventurousKate" },
    { username: "Bemytravelmuse" },
    { username: "iameileen" },
    { username: "WanderingEarl" },
    { username: "TheBlondeAbroad" },
    { username: "NeverendingFootsteps" },
    { username: "UncorneredMarket" },
    { username: "TheBrokeBackpacker" },
    { username: "ThePlanetD" },
    { username: "BucketListly" }
  ]);
  const [cityId, handleCityId] = useState(props.customProps.hoveredCityArray[0].cityId)
  const [navPosition, handleNavPosition] = useState(0);
  const [cityName, handleCityName] = useState(null);
  const [countryName, handleCountryName] = useState(null);
  const [cityHover, handleCityHover] = useState(true);
  const [blogPostCards, handleBlogPostCards] = useState([]);
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
        filteredBlogPosts = blogPosts
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
              post.type !== blogPosts[i - 1].type
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

  function handleNewNavPosition(position) {
    handleNavPosition(position);
  }

  function handleBlogPostHelper(data)  {
    let newBlogPosts = [];
    console.log(data);
    for (let i in data) {
      for (let j in data[i].Places_visited) {
        let newBlogPost = {
          username: data[i].username,
          avatarIndex: data[i].avatarIndex,
          color: data[i].color,
          city: data[i].Places_visited[j].city,
          cityId: data[i].Places_visited[j].cityId,
          country: data[i].Places_visited[j].country,
          countryId: data[i].Places_visited[j].countryId,
          year: data[i].Places_visited[j].BlogPosts[0].year,
          tripTiming: 0,
          url: data[i].Places_visited[j].BlogPosts[0].url,
          title: data[i].Places_visited[j].BlogPosts[0].name,
          type: data[i].Places_visited[j].BlogPosts[0].type
        };
        newBlogPosts.push(newBlogPost)
      }
    }
    handleBlogPosts(newBlogPosts);
  }
  console.log(blogPosts)
  return (
    <Query
      query={GET_BLOG_POSTS_FROM_CITY}
      variables={{ multiUsernames, cityId }}
      notifyOnNetworkStatusChange
      partialRefetch={true}
      onCompleted={(data) => handleBlogPostHelper(data.getPostsFromCity)}
    >
      {({ loading, error, data, refetch }) => {
        if (loading) return <Loader />;
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
