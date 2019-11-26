import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import {
  UPDATE_VISITED_CITY_COMMENTS,
  UPDATE_LIVING_CITY_COMMENTS,
  UPDATE_VISITING_CITY_COMMENTS
} from "../../../../GraphQL";
import CityLivedPopup from "../../../../components/Prompts/ClickedCountry/CityLivedPopup";

function CityCommentaryContainer({ city, refetch }) {
  const [loaded, handleLoaded] = useState(false);
  const [feedbackState, handleFeedbackClick] = useState(false);
  const [cityComments, handleCityComments] = useState({
    best_comment: city.best_comment,
    hardest_comment: city.hardest_comment
  });
  const [id] = useState(city.id);
  const [edit, handleEdit] = useState(false);

  function handleBestChange(comment) {
    cityComments.best_comment = comment;
    handleCityComments(cityComments);
  }

  function handleHardestChange(comment) {
    cityComments.hardest_comment = comment;
    handleCityComments(cityComments);
  }

  useEffect(() => {
    handleLoaded(true);
  }, []);

  if (!loaded) return "Loading";
  return (
    <div className="city-commentary-container">
      <span className="city-commentary-subtitle">Best Memory</span>
      {edit ? (
        <textarea
          className="city-commentary-textarea"
          id="best-memory-entry"
          placeholder={
            city.timing === "future"
              ? "What are you looking forward to the most in " +
                city.city +
                " ?"
              : "Enter your best memory from " + city.city
          }
          onChange={e => handleBestChange(e.target.value)}
          defaultValue={cityComments.best_comment}
        ></textarea>
      ) : (
        <textarea
          className="city-commentary-textarea city-commentary-unedit"
          id="best-memory-entry"
          readOnly
          placeholder={
            cityComments.best_comment !== null
              ? cityComments.best_comment
              : city.timing === "future"
              ? "What are you looking forward to the most in " +
                city.city +
                " ?"
              : "Enter your best memory from " + city.city
          }
        ></textarea>
      )}
      <span className="city-commentary-subtitle">Biggest Challenge</span>
      {edit ? (
        <textarea
          className="city-commentary-textarea"
          id="biggest-challenge-entry"
          placeholder={
            city.timing === "future"
              ? "What do you think will be the hardest part of being in " +
                city.city +
                " ?"
              : "Enter the biggest challenge of being in " + city.city
          }
          onChange={e => handleHardestChange(e.target.value)}
          defaultValue={cityComments.hardest_comment}
        ></textarea>
      ) : (
        <textarea
          className="city-commentary-textarea city-commentary-unedit"
          id="biggest-challenge-entry"
          placeholder={
            cityComments.hardest_comment !== null
              ? cityComments.hardest_comment
              : city.timing === "future"
              ? "What do you think will be the hardest part of being in " +
                city.city +
                " ?"
              : "Enter the biggest challenge of being in " + city.city
          }
          readOnly
        ></textarea>
      )}
      <Mutation
        mutation={
          city.timing === "past"
            ? UPDATE_VISITED_CITY_COMMENTS
            : city.timing === "future"
            ? UPDATE_VISITING_CITY_COMMENTS
            : UPDATE_LIVING_CITY_COMMENTS
        }
        variables={{ id, cityComments }}
        onCompleted={() => refetch()}
      >
        {mutation =>
          edit ? (
            <span className="large confirm button" onClick={mutation}>
              Update
            </span>
          ) : (
            <span className="large button" onClick={handleEdit}>
              Edit
            </span>
          )
        }
      </Mutation>
    </div>
  );
}

CityCommentaryContainer.propTypes = {
  results: PropTypes.object,
  city: PropTypes.object,
  refetch: PropTypes.func
};

export default CityCommentaryContainer;
