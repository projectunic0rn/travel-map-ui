import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import { ADD_USER_SOCIAL } from "../../../../GraphQL";

import FacebookIcon from "../../../../icons/SocialIcons/FacebookIcon";
import InstagramIcon from "../../../../icons/SocialIcons/InstagramIcon";
import TwitterIcon from "../../../../icons/SocialIcons/TwitterIcon";
import WhatsappIcon from "../../../../icons/SocialIcons/WhatsappIcon";
import SimpleLoader from "../../../../components/common/SimpleLoader";

export default function Contact({
  userData,
  handleUserDataChange,
  urlUsername
}) {
  const [edit, handleEdit] = useState(false);
  const [loading, handleLoading] = useState(true);
  const [userSocials, handleUserSocials] = useState([
    { id: 0, link: "", name: "instagram" },
    { id: 0, link: "", name: "facebook" },
    { id: 0, link: "", name: "whatsapp" },
    { id: 0, link: "", name: "twitter" }
  ]);

  useEffect(() => {
    for (let i in userData.UserSocials) {
      if (userData.UserSocials[i].name === "instagram") {
        userSocials[0].id = userData.UserSocials[i].id;
        userSocials[0].name = userData.UserSocials[i].name;
        userSocials[0].link = userData.UserSocials[i].link;
      } else if (userData.UserSocials[i].name === "facebook") {
        userSocials[1].id = userData.UserSocials[i].id;
        userSocials[1].name = userData.UserSocials[i].name;
        userSocials[1].link = userData.UserSocials[i].link;
      } else if (userData.UserSocials[i].name === "whatsapp") {
        userSocials[2].id = userData.UserSocials[i].id;
        userSocials[2].name = userData.UserSocials[i].name;
        userSocials[2].link = userData.UserSocials[i].link;
      } else if (userData.UserSocials[i].name === "twitter") {
        userSocials[3].id = userData.UserSocials[i].id;
        userSocials[3].name = userData.UserSocials[i].name;
        userSocials[3].link = userData.UserSocials[i].link;
      }
    }
    handleLoading(false);
  }, [userData, userSocials]);
  function handleSocialHelper(index, value) {
    let newUserSocials = userSocials;
    newUserSocials[index].link = value;
    handleUserSocials(newUserSocials);
  }
  function handleEditButton() {
    let editState = edit;
    handleEdit(!editState);
  }
  function handleDataSave() {
    let newUserData = userData;
    newUserData.UserSocials = userSocials;
    handleUserDataChange(newUserData);
  }
  if (loading) return <SimpleLoader />;
  return (
    <div className="settings-contact-container">
      <div className="contact-social">
        <span className="contact-header">SOCIAL</span>
        <div className="contact-social-sub" id="contact-instagram">
          <span
            className={
              userSocials[0].link !== ""
                ? "contact-social-icon csi-active "
                : "contact-social-icon"
            }
          >
            <InstagramIcon />
          </span>
          {!edit ? (
            <span className="contact-social-input contact-data">
              {userSocials[0] !== undefined ? userSocials[0].link : ""}
            </span>
          ) : (
            <input
              className="contact-social-input"
              autoFocus
              onChange={e => handleSocialHelper(0, e.target.value)}
              placeHolder="Enter the full url link here"
              defaultValue={
                userSocials[0] !== undefined ? userSocials[0].link : ""
              }
            ></input>
          )}
        </div>
        <div className="contact-social-sub" id="contact-facebook">
          <span
            className={
              userSocials[1].link !== ""
                ? "contact-social-icon csi-active "
                : "contact-social-icon"
            }
          >
            <FacebookIcon />
          </span>
          {!edit ? (
            <span className="contact-social-input contact-data">
              {userSocials[1] !== undefined ? userSocials[1].link : ""}
            </span>
          ) : (
            <input
              className="contact-social-input"
              onChange={e => handleSocialHelper(1, e.target.value)}
              placeHolder="Enter the full url link here"
              defaultValue={
                userSocials[1] !== undefined ? userSocials[1].link : ""
              }
            ></input>
          )}
        </div>
        <div className="contact-social-sub" id="contact-whatsapp">
          <span
            className={
              userSocials[2].link !== ""
                ? "contact-social-icon csi-active "
                : "contact-social-icon"
            }
          >
            <WhatsappIcon />
          </span>
          {!edit ? (
            <span className="contact-social-input contact-data">
              {userSocials[2] !== undefined ? userSocials[2].link : ""}
            </span>
          ) : (
            <input
              className="contact-social-input"
              onChange={e => handleSocialHelper(2, e.target.value)}
              placeHolder="Enter the full url link here"
              defaultValue={
                userSocials[2] !== undefined ? userSocials[2].link : ""
              }
            ></input>
          )}
        </div>
        <div className="contact-social-sub" id="contact-twitter">
          <span
            className={
              userSocials[3].link !== ""
                ? "contact-social-icon csi-active "
                : "contact-social-icon"
            }
          >
            <TwitterIcon />
          </span>
          {!edit ? (
            <span className="contact-social-input contact-data">
              {userSocials[3] !== undefined ? userSocials[3].link : ""}
            </span>
          ) : (
            <input
              className="contact-social-input"
              onChange={e => handleSocialHelper(3, e.target.value)}
              placeHolder="Enter the full url link here"
              defaultValue={
                userSocials[3] !== undefined ? userSocials[3].link : ""
              }
            ></input>
          )}
        </div>
      </div>
      {urlUsername ? null : (
        <div className="settings-edit-button-container">
          <Mutation
            mutation={ADD_USER_SOCIAL}
            variables={{ userSocials }}
            onCompleted={handleDataSave}
          >
            {mutation =>
              edit ? (
                <span className="confirm button" onClick={mutation}>
                  Update
                </span>
              ) : (
                <span
                  className="confirm button"
                  onClick={handleEditButton}
                >
                  Edit
                </span>
              )
            }
          </Mutation>
        </div>
      )}
    </div>
  );
}

Contact.propTypes = {
  userData: PropTypes.object,
  handleUserDataChange: PropTypes.func,
  urlUsername: PropTypes.string
};
