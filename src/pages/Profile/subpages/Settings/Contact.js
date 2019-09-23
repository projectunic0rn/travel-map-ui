import React from "react";
import FacebookIcon from '../../../../icons/SocialIcons/FacebookIcon';
import InstagramIcon from '../../../../icons/SocialIcons/InstagramIcon';
import TwitterIcon from '../../../../icons/SocialIcons/TwitterIcon';
import WhatsappIcon from '../../../../icons/SocialIcons/WhatsappIcon';
 

export default function Contact() {
  return (
    <div className="settings-contact-container">
      <div className="contact-primary">
        <div className="contact-sub-container" id ="contact-email">
          <span className="contact-header">EMAIL</span>
          <input className="contact-input"></input>
        </div>
        <div className="contact-sub-container" id = "contact-phone">
          <span className="contact-header">PHONE NUMBER</span>
          <input className="contact-input"></input>
        </div>
      </div>
      <div className = 'contact-social'>
          <div className = 'contact-social-sub' id = "contact-instagram">
              <span className = 'contact-social-icon'><InstagramIcon /></span>
              <input className = 'contact-social-input'></input>
          </div>
          <div className = 'contact-social-sub' id = "contact-facebook">
              <span className = 'contact-social-icon'><FacebookIcon /></span>
              <input className = 'contact-social-input'></input>
          </div>
          <div className = 'contact-social-sub' id = "contact-whatsapp">
              <span className = 'contact-social-icon'><WhatsappIcon /></span>
              <input className = 'contact-social-input'></input>
          </div>
          <div className = 'contact-social-sub' id = "contact-twitter">
              <span className = 'contact-social-icon'><TwitterIcon /></span>
              <input className = 'contact-social-input'></input>
          </div>
      </div>
    </div>
  );
}
