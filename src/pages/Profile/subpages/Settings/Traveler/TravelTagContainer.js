import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function TravelTagContainer({
  tagName,
  tagIcon,
  color,
  tagsSelected,
  handleTagClick
}) {
  const [clicked, handleClickChange] = useState(false);
  useEffect(() => {
    if (tagsSelected.includes(tagName)) {
        handleClickChange(true);
    }
  }, [tagsSelected]);
  function handleClick() {
    handleTagClick(tagName);
    if (tagsSelected.includes(tagName)) {
        handleClickChange(true);
    } else {
        handleClickChange(false);
    }
  }

  return (
    <div
      className={clicked ? "travel-tag-active" : "travel-tag"}
      onClick={handleClick}
    >
      <span className="travel-tag-icon">{tagIcon}</span>
      <span
        className="travel-tag-title"
        style={clicked ? { color: color } : null}
      >
        {tagName}
      </span>
    </div>
  );
}

TravelTagContainer.propTypes = {
  tagName: PropTypes.string,
  tagIcon: PropTypes.object,
  color: PropTypes.string,
  tagsSelected: PropTypes.array,
  handleTagClick: PropTypes.func
};
