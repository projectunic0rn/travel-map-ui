import React, { useState } from "react";
import PropTypes from "prop-types";

import BasicsIcon from "../../../icons/BasicsIcon";
import ContactIcon from "../../../icons/ContactIcon";
import SecurityIcon from "../../../icons/SecurityIcon";
import TravelerIcon from "../../../icons/TravelerIcon";
import Basics from "./Settings/Basics";
import Contact from "./Settings/Contact";
import Security from "./Settings/Security";
import TravelerInfo from "./Settings/TravelerInfo";

const fakeUserData = {
  username: "User 1",
  email: "userOne@aol.com",
  phoneNumber: "555-234-2908",
  social: {
    instagram: "userOne@instagram.com",
    facebook: "useroUno@fb.com",
    whatsapp: "915-234-2908"
  }
};

export default function Settings({
  userData,
  handlePageRender,
  handleUserDataChange
}) {
  const [friendPage, handleFriendPage] = useState(2);
  let pageRender = "";
  let className = "";
  switch (friendPage) {
    case 0:
      pageRender = <Basics />;
      className = "content content-settings-page";
      handlePageRender("settings");
      break;
    case 1:
      pageRender = (
        <Contact
          email={fakeUserData.email}
          phoneNumber={fakeUserData.phoneNumber}
          social={fakeUserData.social}
        />
      );
      className = "content content-settings-page";
      handlePageRender("settings");
      break;
    case 2:
      pageRender = (
        <TravelerInfo
          userData={userData}
          handleUserDataChange={handleUserDataChange}
        />
      );
      className = "content content-settings-page";
      handlePageRender("settings");
      break;
    case 3:
      pageRender = <Security />;
      className = "content content-settings-page";
      handlePageRender("settings");
      break;
    default:
      break;
  }
  return (
    <div className={className}>
      <div className="sidebar-filter">
        <button
          onClick={() => handleFriendPage(0)}
          className={friendPage === 0 ? "active" : ""}
        >
          <BasicsIcon /> basics
        </button>
        <button
          onClick={() => handleFriendPage(1)}
          className={friendPage === 1 ? "active" : ""}
        >
          <ContactIcon /> contact
        </button>
        <button
          onClick={() => handleFriendPage(2)}
          className={friendPage === 2 ? "active" : ""}
        >
          <TravelerIcon /> traveler
        </button>
        <button
          onClick={() => handleFriendPage(3)}
          className={friendPage === 3 ? "active" : ""}
        >
          <SecurityIcon /> security
        </button>
      </div>
      <div className="content-results">{pageRender}</div>
    </div>
  );
}

Settings.propTypes = {
  handlePageRender: PropTypes.func,
  userData: PropTypes.object,
  handleUserDataChange: PropTypes.func
};
