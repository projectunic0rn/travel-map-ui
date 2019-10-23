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
    for (let i in tagsSelected) {
      if (tagsSelected[i].name === tagName) {
        handleClickChange(true);
        return;
      }
    }
  }, [tagsSelected, tagName]);
  function handleClick() {
    handleTagClick(tagName);

    for (let i in tagsSelected) {
      if (tagsSelected[i].name === tagName) {
        handleClickChange(true);
        return;
      } else {
        handleClickChange(false);
      }
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
