import React, { useState } from "react";
import PropTypes from "prop-types";
import FacebookIcon from "../../../../icons/SocialIcons/FacebookIcon";
import InstagramIcon from "../../../../icons/SocialIcons/InstagramIcon";
import TwitterIcon from "../../../../icons/SocialIcons/TwitterIcon";
import WhatsappIcon from "../../../../icons/SocialIcons/WhatsappIcon";

export default function Contact({ social, email, phoneNumber }) {
  const [edit, handleEdit] = useState(false);
  const [currentEmail, handleEmailChange] = useState(email);
  const [currentPhoneNumber, handlePhoneNumberChange] = useState(phoneNumber);
  const [currentInstagram, handleInstagramChange] = useState(social.instagram);
  const [currentFacebook, handleFacebookChange] = useState(social.facebook);
  const [currentWhatsapp, handleWhatsappChange] = useState(social.whatsapp);
  const [currentTwitter, handleTwitterChange] = useState(social.twitter);

  function handleEditButton() {
    let editState = edit;
    handleEdit(!editState);
  }
  return (
    <div className="settings-contact-container">
      <div className="contact-primary">
        <div className="contact-sub-container" id="contact-email">
          <span className="contact-header">EMAIL</span>
          {!edit ? (
            <span className="contact-input contact-data">{currentEmail}</span>
          ) : (
            <input
              className="contact-input"
              onChange={e => handleEmailChange(e.target.value)}
              value={currentEmail}
            ></input>
          )}
        </div>
        <div className="contact-sub-container" id="contact-phone">
          <span className="contact-header">PHONE NUMBER</span>
          {!edit ? (
            <span className="contact-input contact-data">
              {currentPhoneNumber}
            </span>
          ) : (
            <input
              className="contact-input"
              onChange={e => handlePhoneNumberChange(e.target.value)}
              value={currentPhoneNumber}
            ></input>
          )}
        </div>
      </div>
      <div className="contact-social">
        <span className="contact-header">SOCIAL</span>
        <div className="contact-social-sub" id="contact-instagram">
          <span
            className={
              currentInstagram !== undefined && currentInstagram !== ""
                ? "contact-social-icon csi-active "
                : "contact-social-icon"
            }
          >
            <InstagramIcon />
          </span>
          {!edit ? (
            <span className="contact-social-input contact-data">
              {currentInstagram}
            </span>
          ) : (
            <input
              className="contact-social-input"
              onChange={e => handleInstagramChange(e.target.value)}
              value={currentInstagram}
            ></input>
          )}
        </div>
        <div className="contact-social-sub" id="contact-facebook">
          <span
            className={
              currentFacebook !== undefined && currentFacebook !== ""
                ? "contact-social-icon csi-active "
                : "contact-social-icon"
            }
          >
            <FacebookIcon />
          </span>
          {!edit ? (
            <span className="contact-social-input contact-data">
              {currentFacebook}
            </span>
          ) : (
            <input
              className="contact-social-input"
              onChange={e => handleFacebookChange(e.target.value)}
              value={currentFacebook}
            ></input>
          )}
        </div>
        <div className="contact-social-sub" id="contact-whatsapp">
          <span
            className={
              currentWhatsapp !== undefined && currentWhatsapp !== ""
                ? "contact-social-icon csi-active "
                : "contact-social-icon"
            }
          >
            <WhatsappIcon />
          </span>
          {!edit ? (
            <span className="contact-social-input contact-data">
              {currentWhatsapp}
            </span>
          ) : (
            <input
              className="contact-social-input"
              onChange={e => handleWhatsappChange(e.target.value)}
              value={currentWhatsapp}
            ></input>
          )}
        </div>
        <div className="contact-social-sub" id="contact-twitter">
          <span
            className={
              currentTwitter !== undefined && currentTwitter !== ""
                ? "contact-social-icon csi-active "
                : "contact-social-icon"
            }
          >
            <TwitterIcon />
          </span>
          {!edit ? (
            <span className="contact-social-input contact-data">
              {currentTwitter}
            </span>
          ) : (
            <input
              className="contact-social-input"
              onChange={e => handleTwitterChange(e.target.value)}
              value={currentTwitter}
            ></input>
          )}
        </div>
      </div>
      <div className="settings-edit-button-container">
        <span className="settings-edit-button" onClick={handleEditButton}>
          {edit ? "Update" : "Edit"}
        </span>
      </div>
    </div>
  );
}

Contact.propTypes = {
  social: PropTypes.object,
  email: PropTypes.string,
  phoneNumber: PropTypes.string
};
