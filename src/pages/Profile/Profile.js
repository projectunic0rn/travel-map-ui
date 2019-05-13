import React from 'react';
import Sidebar from './Sidebar';

export default function Profile() {
  return (
    <div className="page page-profile">
      <div className="container">
        <Sidebar />
        <div className="content content-nav">
          <h1>Content Nav</h1>
        </div>
        <div className="content">
          <h1>Content</h1>
        </div>
      </div>
    </div>
  );
}
