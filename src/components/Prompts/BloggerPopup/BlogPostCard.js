import React from "react";
import PropTypes from "prop-types";
import UserAvatar from "../../UserAvatar/UserAvatar";

function BlogPostCard(props) {
  return (
    <a href={props.post.url} target="_blank" rel="noopener noreferrer">
      <div className="blogger-post-card">
        <div className="user-profile-image">
          <UserAvatar
            avatarIndex={
              props.post.avatarIndex !== null ? props.post.avatarIndex : 1
            }
            color={props.post.color}
          />
        </div>
        <div className="utc-user-info-container">
          <span className="utc-blogger-name">{props.post.username}</span>
          <span className="bpc-post-title">{props.post.title}</span>
        </div>
        <div
          className={
            "utc-year-container utc-year-container-" + props.post.tripTiming
          }
        >
          <p className="utc-year">{props.post.year}</p>
        </div>
      </div>
    </a>
  );
}

BlogPostCard.propTypes = {
  post: PropTypes.object,
  metricValue: PropTypes.number,
  metric: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default BlogPostCard;
