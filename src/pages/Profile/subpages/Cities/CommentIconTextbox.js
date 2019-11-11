import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function CommentIconTextbox({ comment, handleCommentText, handleSaveComment }) {
const [loaded, handleLoaded] = useState(false);
useEffect(() => {
  handleLoaded(true);
}, [comment])
  if (!loaded) return null;
  return (
    <div className="comment-icon-modal">
      <textarea
        type="text"
        onChange={e => handleCommentText(e.target.value)}
        className="comment-icon-text"
        placeholder="Enter comment..."
        autoFocus={true}
        defaultValue={comment}
      >
      </textarea>
      <div className="comment-icon-buttons">
        <button className="comment-icon-save" onClick={handleSaveComment}>
          Save Comment
        </button>
      </div>
    </div>
  );
}

CommentIconTextbox.propTypes = {
  comment: PropTypes.string,
  handleCommentText: PropTypes.func,
  handleSaveComment: PropTypes.func
};

export default CommentIconTextbox;
