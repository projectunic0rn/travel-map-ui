import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { interestConsts } from "../../../InterestConsts";
import SimpleLoader from "../../../components/common/SimpleLoader";

function InterestTag({ name }) {
  const [color, handleColor] = useState("");
  const [background, handleBackground] = useState("");
  useEffect(() => {
    let tag =
      interestConsts[
        interestConsts.findIndex(obj => {
          return obj.interest === name;
        })
      ];
      if (tag === undefined) {
          return
      }
      handleColor(tag.color);
      handleBackground(tag.background);
  }, [name]);
  if (name === "") return null;
  if (color === "") return <SimpleLoader />
  return (
    <span
      className="tag"
      style={{ color: color, background: background }}
    >
      {name}
    </span>
  );
}

InterestTag.propTypes = {
  color: PropTypes.string,
  name: PropTypes.string
};

export default InterestTag;
