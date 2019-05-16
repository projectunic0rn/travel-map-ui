import React from "react";
import UserAvatar from "../../UserAvatar/UserAvatar";

export default function Header() {
  return (
    <div className="user-header-container">
      <a href="#" className="user-link">
        <span className="header-username">USERNAME</span>
        <UserAvatar />
      </a>
    </div>
  );
}
