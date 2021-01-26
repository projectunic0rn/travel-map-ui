import React from "react";
import PropTypes from "prop-types";

import ShareIcon from "../../../icons/ShareIcon";

function ShareButton({ username }) {
  function shareMap() {
    let copyText = document.getElementById("myShareLink");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert("Copied the text: " + copyText.value);
  }

  return (
    <div className="personal-map-share" id="city-map-share" onClick={shareMap}>
      <input
        type="text"
        defaultValue={
          "https://geornal.herokuapp.com/public/" + username
        }
        id="myShareLink"
      ></input>
      <span>SHARE MY MAP</span>
      <ShareIcon />
    </div>
  );
}

ShareButton.propTypes = {
  username: PropTypes.string,
};

export default ShareButton;
