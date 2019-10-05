import React from "react";
import { Route, NavLink } from "react-router-dom";

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

export default function Settings() {
  return (
    <div className="settings content">
      <div className="sidebar-filter">
        <NavLink exact to="/profile/settings/">
          <BasicsIcon />
          basics
        </NavLink>
        <NavLink to="/profile/settings/contact">
          <ContactIcon />
          contact
        </NavLink>
        <NavLink to="/profile/settings/traveler">
          <TravelerIcon />
          traveler
        </NavLink>
        <NavLink to="/profile/settings/security">
          <SecurityIcon />
          security
        </NavLink>
      </div>
      <div className="content-results">
        <Route exact path="/profile/settings" component={Basics} />
        <Route
          path="/profile/settings/contact"
          render={() => (
            <Contact
              email={fakeUserData.email}
              phoneNumber={fakeUserData.phoneNumber}
              social={fakeUserData.social}
            />
          )}
        />
        <Route path="/profile/settings/traveler" component={TravelerInfo} />
        <Route path="/profile/settings/security" component={Security} />
      </div>
    </div>
  );
}
