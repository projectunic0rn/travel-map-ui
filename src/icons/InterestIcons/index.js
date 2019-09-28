import React from "react";
import PropTypes from "prop-types";

import AdventureIcon from "./AdventureIcon";
import FoodieIcon from "./FoodieIcon";
import NatureIcon from "./NatureIcon";
import Articon from "./ArtIcon";
import FrugalIcon from "./FrugalIcon";
import GuidedTouristIcon from "./GuidedTouristIcon";
import HistoryIcon from "./HistoryIcon";
import LikeALocalIcon from "./LikeALocalIcon";
import LuxuriousIcon from "./LuxuriousIcon";
import PartierIcon from "./PartierIcon";
import PhotographerIcon from "./PhotographerIcon";
import PlannerIcon from "./PlannerIcon";
import RelaxerIcon from "./RelaxerIcon";
import RoadLessIcon from "./RoadLessIcon";
import ShoppingIcon from "./ShoppingIcon";
import SocialiteIcon from "./SocialiteIcon";
import WandererIcon from "./WandererIcon";

const Icon = props => {
  switch (props.name) {
    case "adventurer":
      return <AdventureIcon {...props} />;
    case "foodie":
      return <FoodieIcon {...props} />;
    case "nature lover":
      return <NatureIcon {...props} />;
    case "art connoisseur":
      return <Articon {...props} />;
    case "frugal":
      return <FrugalIcon {...props} />;
    case "guided tourist":
      return <GuidedTouristIcon {...props} />;
    case "history buff":
      return <HistoryIcon {...props} />;
    case "like a local":
      return <LikeALocalIcon {...props} />;
    case "luxurious":
      return <LuxuriousIcon {...props} />;
    case "party animal":
      return <PartierIcon {...props} />;
    case "planner":
      return <PlannerIcon {...props} />;
    case "photographer":
      return <PhotographerIcon {...props} />;
    case "relaxer":
      return <RelaxerIcon {...props} />;
    case "road less traveled":
      return <RoadLessIcon {...props} />;
    case "shopaholic":
      return <ShoppingIcon {...props} />;
    case "socialite":
      return <SocialiteIcon {...props} />;
    case "wanderer":
      return <WandererIcon {...props} />;
    default:
      return null;
  }
};

Icon.propTypes = {
  name: PropTypes.string
};

export default Icon;
