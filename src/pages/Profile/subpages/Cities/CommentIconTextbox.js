import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function CommentIconTextbox({
  edit,
  comment,
  handleSaveComment,
  handleCommentChange,
  closeComment
}) {
  const [loaded, handleLoaded] = useState(false);
  useEffect(() => {
    handleLoaded(true);
  }, [comment]);
  if (!loaded) return null;
  return (
    <div className="comment-icon-modal">
      {edit ? (
        <textarea
          type="text"
          onChange={e => handleCommentChange(e.target.value)}
          className="comment-icon-text"
          placeholder="Enter comment..."
          autoFocus={true}
          defaultValue={comment}
        ></textarea>
      ) : (
        <textarea
          type="text"
          onChange={e => handleCommentChange(e.target.value)}
          className="comment-icon-text"
          placeholder={(comment === "" || comment === null) ? "Enter comment..." : comment}
          autoFocus={true}
          readOnly
        ></textarea>
      )}
      <div className="comment-icon-buttons">
        <button className="comment-icon-save" onClick={closeComment}>
          Close
        </button>
      </div>
    </div>
  );
}

CommentIconTextbox.propTypes = {
  comment: PropTypes.string,
  edit: PropTypes.bool,
  handleSaveComment: PropTypes.func,
  handleCommentChange: PropTypes.func,
  closeComment: PropTypes.func
};

export default CommentIconTextbox;
