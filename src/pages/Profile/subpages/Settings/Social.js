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
  function handleInput(value, index) {
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

  function getIcon(item) {
    switch (item.name) {
      case "instagram":
        return <InstagramIcon />;
      case "twitter":
        return <TwitterIcon />;
      case "facebook":
        return <FacebookIcon />;
      case "whatsapp":
        return <WhatsappIcon />;
    }
  }

  if (loading) return <SimpleLoader />;
  return (
    <div className="social-container">
      <h3 className="header">Social Media</h3>
      {userSocials.map((item, index) => (
        <div key={index} className={`media-container ${edit ? "edit" : ""}`}>
          {edit ? (
            <>
              <span className="icon">{getIcon(item)}</span>
              <input
                onChange={(e) => handleInput(e.target.value, index)}
                placeholder="Include `https`"
                className="input"
                value={userSocials[index].url}
                type="text"
                defaultValue={item.url}
              >
                {item.url}
              </input>
            </>
          ) : item.link !== "" ? (
            <a target="__blank" className="media" href={item.link}>
              <span className="icon">{getIcon(item)}</span>
            </a>
          ) : null}
        </div>
      ))}

      {urlUsername ? null : (
        <Mutation
          mutation={ADD_USER_SOCIAL}
          variables={{ userSocials }}
          onCompleted={handleDataSave}
        >
          {(mutation) =>
            edit ? (
              <span className="large confirm button" onClick={mutation}>
                Update
              </span>
            ) : (
              <span className="large button" onClick={handleEditButton}>
                Edit
              </span>
            )
          }
        </Mutation>
      )}
    </div>
  );
}

Contact.propTypes = {
  userData: PropTypes.object,
  handleUserDataChange: PropTypes.func,
  urlUsername: PropTypes.string
};
