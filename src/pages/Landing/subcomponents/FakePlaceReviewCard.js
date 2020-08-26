import React from "react";
import UserAvatar from "../../../components/UserAvatar/UserAvatar";
import avatar from "../../../images/Avatar_trial8_rotate_12_yellow.png";
import FeedbackBoxStatic from "../../Place/FeedbackBoxStatic";

function FakePlaceReviewCard() {
  return (
    <>
      <div className="place-review-card-container prcc-past">
        <div className="place-review-user">
          {/* <UserAvatar avatarIndex={2} color={"#C8B343"} email={""} /> */}
          <img src={avatar} style={{ width: "60px" }} alt="avatar"/>

          <span className="pr-username">user4</span>
          <FeedbackBoxStatic review={{ rating: 2 }} comment={1} email={""} />
        </div>
        <div className="pr-card-content">
          <div className="place-review-card">
            <div className="pr-input-container">
              <>
                <span className="pr-input-title">Fairmont Springs Banff</span>
                <span className="pr-input-span">Stay</span>
              </>
            </div>
            <div className="cost-container">
              <div className="cost-icon-modal">
                <input
                  type="integer"
                  readOnly
                  className="cost-icon-text"
                  placeholder={740}
                />
                <div className="cost-icon-currency-noedit">USD</div>
              </div>
            </div>
          </div>
          <div className="comment-container">
            Impressive to look at, fun to be in a castle for a little while
          </div>
        </div>
      </div>
      <div className="place-review-card-container prcc-past">
        <div className="place-review-user">
          {/* <UserAvatar avatarIndex={4} color={"rgb(200, 46, 100"} email={""} /> */}
          <img src={avatar} style={{ width: "60px" }}  alt="avatar"/>
          <span className="pr-username">user1</span>
          <FeedbackBoxStatic review={{ rating: 2 }} comment={1} />
        </div>
        <div className="pr-card-content">
          <div className="place-review-card">
            <div className="pr-input-container">
              <>
                <span className="pr-input-title">
                  Lake Agnes Tea House Hike
                </span>
                <span className="pr-input-span">Activity</span>
              </>
            </div>
            <div className="cost-container">
              <div className="cost-icon-modal">
                <input
                  type="integer"
                  readOnly
                  className="cost-icon-text"
                  placeholder={0}
                />
                <div className="cost-icon-currency-noedit">USD</div>
              </div>
            </div>
          </div>
          <div className="comment-container">
            Beautiful views of Lake Louise and a moderate hike overall. Most
            areas are exposed so bring sunscreen if doing the hike in the summer
            time. When we were there, there was still some snow which made some
            parts tricky without poles. The tea house itself was a welcome
            relief at the end of the hike and had some good drinks and treats.
          </div>
        </div>
      </div>
    </>
  );
}

export default FakePlaceReviewCard;
