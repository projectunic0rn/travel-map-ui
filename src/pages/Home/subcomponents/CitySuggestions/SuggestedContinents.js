import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const continents = [
  "Africa",
  "Asia",
  "Europe",
  "NorthAmerica",
  "Oceania",
  "SouthAmerica",
  "Antarctica"
];

export default function SuggestedContinents({ handleContinents, contArray }) {
  const [localContArray, handleContArray] = useState(contArray);
  function handleContinentClick(continent) {
    let newContIndexArray = [...localContArray];
    if (newContIndexArray.indexOf(continent) === -1) {
      newContIndexArray.push(continent);
    } else {
      newContIndexArray.splice(newContIndexArray.indexOf(continent), 1);
    }
    handleContArray(newContIndexArray);
    handleContinents(newContIndexArray);
  }
  return (
    <div className="sc-continents">
      {continents.map((continent, index) => {
        return (
          <span
            key={continent + index}
            id={
              localContArray.indexOf(continent) !== -1
                ? "sc-" + continent + "-active"
                : "sc-" + continent
            }
            className="sc-choice-card"
            onClick={() => handleContinentClick(continent)}
          >
            {continent === "NorthAmerica"
              ? "North America"
              : continent === "SouthAmerica"
              ? "South America"
              : continent}
          </span>
        );
      })}
    </div>
  );
}

SuggestedContinents.propTypes = {
  handleContinents: PropTypes.func,
  contArray: PropTypes.array
};
