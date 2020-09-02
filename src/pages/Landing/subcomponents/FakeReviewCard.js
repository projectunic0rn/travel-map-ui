import React from "react";

import RecommendIcon from "../../../icons/RecommendIcon";
import DoNotRecommendIcon from "../../../icons/DoNotRecommendIcon";
import NeutralIcon from "../../../icons/NeutralIcon";
import CostIcon from "../../../icons/CostIcon";
import CommentIcon from "../../../icons/CommentIcon";

function FakeCityReviewCard() {
      return (
    <>
      <div className="city-review-card-container">
        <div className="city-review-card">
          <div className="crc-input-container">
          <>
              <span className="crc-input-title">nature</span>
              <span className="crc-input-span">Valley of the Ten Peaks</span>
            </>
          </div>
          <>
            <div className="crc-icon-container">
              <div className="feedback-subcontainer">
                <span className="feedback-header">rating</span>
                <div className="feedback-ratings">
                  <RecommendIcon value={true} />
                  <NeutralIcon value={false} />
                  <DoNotRecommendIcon value={false} />
                </div>
              </div>
              <div className="feedback-subcontainer" id="feedback-comment-sub">
                <span className="feedback-header">comment</span>
                <div className="feedback-ratings">
                  <CommentIcon value={1} />
                </div>
              </div>
              <div className="feedback-subcontainer">
                <span className="feedback-header">cost</span>
                <div className="feedback-ratings">
                  <CostIcon value={1} />
                </div>
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
          </>
        </div>
        <div className="comment-container">
          <div className="comment-icon-modal">
            <textarea
              type="text"
              className="comment-icon-text"
              placeholder={
                "Beautiful views of Moraine Lake, worth it to get to the top!"
              }
              readOnly
            ></textarea>
          </div>
        </div>
      </div>
      <div className="city-review-card-container">
        <div className="city-review-card">
          <div className="crc-input-container">
            <>
              <span className="crc-input-title">stay</span>
              <span className="crc-input-span">Fairmont Banff Springs</span>
            </>
          </div>
          <>
            <div className="crc-icon-container">
              <div className="feedback-subcontainer">
                <span className="feedback-header">rating</span>
                <div className="feedback-ratings">
                  <RecommendIcon value={true} />
                  <NeutralIcon value={false} />
                  <DoNotRecommendIcon value={false} />
                </div>
              </div>
              <div className="feedback-subcontainer" id="feedback-comment-sub">
                <span className="feedback-header">comment</span>
                <div className="feedback-ratings">
                  <CommentIcon value={1} />
                </div>
              </div>
              <div className="feedback-subcontainer">
                <span className="feedback-header">cost</span>
                <div className="feedback-ratings">
                  <CostIcon value={1} />
                </div>
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
          </>
        </div>
      </div>
    </>
  );
}

export default React.memo(FakeCityReviewCard);
