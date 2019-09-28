import React, { useState } from "react";
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

const fakeUserTags = ["like a local", "frugal", "road less traveled", "foodie"];

export default function TravelerInfo() {
  const [tagsSelected, handleTagChange] = useState(fakeUserTags);
  function handleTagClick(tag) {
    let tags = tagsSelected;
    if (tags.indexOf(tag) === -1 && tagsSelected.length < 4) {
      tags.push(tag);
      handleTagChange(tags);
    } else if (tagsSelected.indexOf(tag) !== -1) {
      tags.splice(tags.indexOf(tag), 1);
      handleTagChange(tags);
    } else {
      alert("Only four tags are allowed");
      return null;
    }
  }

  return (
    <div className="traveler-settings-container">
      <span className="traveler-settings-header">Travel Tags</span>
      <div className="traveler-tag-container">
        <TravelTagContainer
          tagName={"foodie"}
          color={"#d0af5b"}
          tagIcon={<FoodieIcon color={"#e3cd90"} />}
          handleTagClick={handleTagClick}
          tagsSelected={tagsSelected}
        />
        <TravelTagContainer
          tagName={"like a local"}
          color={"#73A7C3"}
          tagIcon={<LikeALocalIcon color={"#C2D7E5"} />}
          handleTagClick={handleTagClick}
          tagsSelected={tagsSelected}
        />
        <TravelTagContainer
          tagName={"nature lover"}
          color={"#7a9a97"}
          tagIcon={<NatureIcon color={"#D1DCDB"} />}
          handleTagClick={handleTagClick}
          tagsSelected={tagsSelected}
        />
        <TravelTagContainer
          tagName={"history buff"}
          color={"#AB9E9D"}
          tagIcon={<HistoryIcon color={"#DED8D7"} />}
          handleTagClick={handleTagClick}
          tagsSelected={tagsSelected}
        />
        <TravelTagContainer
          tagName={"shopaholic"}
          color={"#C68AD1"}
          tagIcon={<ShoppingIcon color={"#ECD4F2"} />}
          handleTagClick={handleTagClick}
          tagsSelected={tagsSelected}
        />
        <TravelTagContainer
          tagName={"photographer"}
          color={"#6D6D6D"}
          tagIcon={<PhotographerIcon color={"#D1D1D1"} />}
          handleTagClick={handleTagClick}
          tagsSelected={tagsSelected}
        />
        <TravelTagContainer
          tagName={"relaxer"}
          color={"#8AA2D1"}
          tagIcon={<RelaxerIcon color={"#D4DBF2"} />}
          handleTagClick={handleTagClick}
          tagsSelected={tagsSelected}
        />
        <TravelTagContainer
          tagName={"adventurer"}
          color={"#B79422"}
          tagIcon={<AdventureIcon color={"#F2DAC5"} />}
          handleTagClick={handleTagClick}
          tagsSelected={tagsSelected}
        />
        <TravelTagContainer
          tagName={"frugal"}
          color={"#A0D99C"}
          tagIcon={<FrugalIcon color={"#D3F8BE"} />}
          handleTagClick={handleTagClick}
          tagsSelected={tagsSelected}
        />
        <TravelTagContainer
          tagName={"party animal"}
          color={"#bb6f7e"}
          tagIcon={<PartierIcon color={"#ECD7DB"} />}
          handleTagClick={handleTagClick}
          tagsSelected={tagsSelected}
        />
        <TravelTagContainer
          tagName={"art connisseur"}
          color={"#9F8AD1"}
          tagIcon={<ArtIcon color={"#DDD4F2"} />}
          handleTagClick={handleTagClick}
          tagsSelected={tagsSelected}
        />
        <TravelTagContainer
          tagName={"guided tourist"}
          color={"#8AB5D1"}
          tagIcon={<GuidedTouristIcon color={"#D4EBF2"} />}
          handleTagClick={handleTagClick}
          tagsSelected={tagsSelected}
        />
        <TravelTagContainer
          tagName={"luxurious"}
          color={"#DCB637"}
          tagIcon={<LuxuriousIcon color={"#EBE0B4"} />}
          handleTagClick={handleTagClick}
          tagsSelected={tagsSelected}
        />
        <TravelTagContainer
          tagName={"road less traveled"}
          color={"#AA716D"}
          tagIcon={<RoadLessIcon color={"#D4B5B2"} />}
          handleTagClick={handleTagClick}
          tagsSelected={tagsSelected}
        />
        <TravelTagContainer
          tagName={"socialite"}
          color={"#D18ACF"}
          tagIcon={<SocialiteIcon color={"#EBC0EB"} />}
          handleTagClick={handleTagClick}
          tagsSelected={tagsSelected}
        />
      </div>
    </div>
  );
}
