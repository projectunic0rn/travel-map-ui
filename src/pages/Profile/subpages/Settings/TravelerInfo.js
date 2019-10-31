import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import { ADD_USER_INTERESTS } from "../../../../GraphQL";

import SaveIcon from '../../../../icons/SaveIcon';
import TravelTagContainer from "./Traveler/TravelTagContainer";
import FoodieIcon from "../../../../icons/InterestIcons/FoodieIcon";
import HistoryIcon from "../../../../icons/InterestIcons/HistoryIcon";
import NatureIcon from "../../../../icons/InterestIcons/NatureIcon";
import ShoppingIcon from "../../../../icons/InterestIcons/ShoppingIcon";
import AdventureIcon from "../../../../icons/InterestIcons/AdventureIcon";
import PhotographerIcon from "../../../../icons/InterestIcons/PhotographerIcon";
import PartierIcon from "../../../../icons/InterestIcons/PartierIcon";
import ArtIcon from "../../../../icons/InterestIcons/ArtIcon";
import LuxuriousIcon from "../../../../icons/InterestIcons/LuxuriousIcon";
import LikeALocalIcon from "../../../../icons/InterestIcons/LikeALocalIcon";
import SocialiteIcon from "../../../../icons/InterestIcons/SocialiteIcon";
import RoadLessIcon from "../../../../icons/InterestIcons/RoadLessIcon";
import FrugalIcon from "../../../../icons/InterestIcons/FrugalIcon";
import GuidedTouristIcon from "../../../../icons/InterestIcons/GuidedTouristIcon";
import RelaxerIcon from "../../../../icons/InterestIcons/RelaxerIcon";

export default function TravelerInfo({ userData, handleUserDataChange }) {
  const [userInterests, handleTagChange] = useState(userData.UserInterests);
  const [showSaveButton, handleShowSave] = useState(false);
  useEffect(() => {
    let interestTypeRemoval = [];
    for (let i in userInterests) {
      interestTypeRemoval.push({
        id: userInterests[i].id,
        name: userInterests[i].name
      });
    }
    handleTagChange(interestTypeRemoval);
  }, [userData.UserInterests], userInterests);
  function handleTagClick(tag) {
    handleShowSave(true);
    let tags = userInterests;
    let newTag = true;
    let nullAvailable = false;
    if (tags.length === 0) {
      tags.push({ id: 0, name: tag });
      handleTagChange(tags);
      return;
    }
    for (let i in tags) {
      if (tags[i].name === "") {
        nullAvailable = i;
      }
      if (tags[i].name === tag) {
        if (tags[i].id === undefined) {
          tags.splice(i, 1);
        } else {
          tags[i].name = "";
        }
        newTag = false;
        handleTagChange(tags);
        return;
      }
    }
    if (newTag) {
      if (nullAvailable !== false) {
        tags[nullAvailable].name = tag;
      } else if (userInterests.length < 4){
        tags.push({ id: 0, name: tag });
      } else {
        alert("Only four tags are allowed")
      }
      handleTagChange(tags);
      return;
    } else {
      alert("Only four tags are allowed");
      return null;
    }
  }
  function handleDataSave() {
    let newUserData = userData;
    newUserData.UserInterests = userInterests;
    handleUserDataChange(newUserData);
  }

  return (
    <div className="traveler-settings-container">
      <Mutation
        mutation={ADD_USER_INTERESTS}
        variables={{ userInterests }}
        onCompleted={handleDataSave}
      >
        {mutation => (
          <span className="traveler-settings-header">
            Travel Tags
            {showSaveButton ? (
              <button className="save-button" onClick={mutation}>
                <SaveIcon />
              </button>
            ) : null}
          </span>
        )}
      </Mutation>
      <div className="traveler-tag-container">
        <TravelTagContainer
          tagName={"foodie"}
          color={"#d0af5b"}
          tagIcon={<FoodieIcon color={"#e3cd90"} />}
          handleTagClick={handleTagClick}
          tagsSelected={userInterests}
        />
        <TravelTagContainer
          tagName={"like a local"}
          color={"#73A7C3"}
          tagIcon={<LikeALocalIcon color={"#C2D7E5"} />}
          handleTagClick={handleTagClick}
          tagsSelected={userInterests}
        />
        <TravelTagContainer
          tagName={"nature lover"}
          color={"#7a9a97"}
          tagIcon={<NatureIcon color={"#D1DCDB"} />}
          handleTagClick={handleTagClick}
          tagsSelected={userInterests}
        />
        <TravelTagContainer
          tagName={"history buff"}
          color={"#AB9E9D"}
          tagIcon={<HistoryIcon color={"#DED8D7"} />}
          handleTagClick={handleTagClick}
          tagsSelected={userInterests}
        />
        <TravelTagContainer
          tagName={"shopaholic"}
          color={"#C68AD1"}
          tagIcon={<ShoppingIcon color={"#ECD4F2"} />}
          handleTagClick={handleTagClick}
          tagsSelected={userInterests}
        />
        <TravelTagContainer
          tagName={"photographer"}
          color={"#6D6D6D"}
          tagIcon={<PhotographerIcon color={"#D1D1D1"} />}
          handleTagClick={handleTagClick}
          tagsSelected={userInterests}
        />
        <TravelTagContainer
          tagName={"relaxer"}
          color={"#8AA2D1"}
          tagIcon={<RelaxerIcon color={"#D4DBF2"} />}
          handleTagClick={handleTagClick}
          tagsSelected={userInterests}
        />
        <TravelTagContainer
          tagName={"adventurer"}
          color={"#B79422"}
          tagIcon={<AdventureIcon color={"#F2DAC5"} />}
          handleTagClick={handleTagClick}
          tagsSelected={userInterests}
        />
        <TravelTagContainer
          tagName={"frugal"}
          color={"#A0D99C"}
          tagIcon={<FrugalIcon color={"#D3F8BE"} />}
          handleTagClick={handleTagClick}
          tagsSelected={userInterests}
        />
        <TravelTagContainer
          tagName={"party animal"}
          color={"#bb6f7e"}
          tagIcon={<PartierIcon color={"#ECD7DB"} />}
          handleTagClick={handleTagClick}
          tagsSelected={userInterests}
        />
        <TravelTagContainer
          tagName={"art connoisseur"}
          color={"#9F8AD1"}
          tagIcon={<ArtIcon color={"#DDD4F2"} />}
          handleTagClick={handleTagClick}
          tagsSelected={userInterests}
        />
        <TravelTagContainer
          tagName={"guided tourist"}
          color={"#8AB5D1"}
          tagIcon={<GuidedTouristIcon color={"#D4EBF2"} />}
          handleTagClick={handleTagClick}
          tagsSelected={userInterests}
        />
        <TravelTagContainer
          tagName={"luxurious"}
          color={"#DCB637"}
          tagIcon={<LuxuriousIcon color={"#EBE0B4"} />}
          handleTagClick={handleTagClick}
          tagsSelected={userInterests}
        />
        <TravelTagContainer
          tagName={"road less traveled"}
          color={"#AA716D"}
          tagIcon={<RoadLessIcon color={"#D4B5B2"} />}
          handleTagClick={handleTagClick}
          tagsSelected={userInterests}
        />
        <TravelTagContainer
          tagName={"socialite"}
          color={"#D18ACF"}
          tagIcon={<SocialiteIcon color={"#EBC0EB"} />}
          handleTagClick={handleTagClick}
          tagsSelected={userInterests}
        />
      </div>
    </div>
  );
}

TravelerInfo.propTypes = {
  userData: PropTypes.object,
  handleUserDataChange: PropTypes.func
};
