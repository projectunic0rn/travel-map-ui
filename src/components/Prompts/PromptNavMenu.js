import React, { useState } from "react";
import PropTypes from "prop-types";
import withMemo from '../../utils/withMemo';

import AllTimingsIcon from '../../icons/AllTimingsIcon';
import FutureIcon from '../../icons/FutureIcon';
import PastIcon from '../../icons/PastIcon';
import LiveIcon from '../../icons/LiveIcon';


function PromptNavMenu(props) {
  const [navPosition, handleNavPosition] = useState(0);
  function handleNavPositionChange(position) {
    handleNavPosition(position);
    props.handleNavPosition(position);
  }
  let classNames = [
    'secondary-nav-icon' +
      (navPosition === 0 ? ' secondary-nav-icon-all-active' : ''),
    'secondary-nav-icon' +
      (navPosition === 1 ? ' secondary-nav-icon-past-active' : ''),
    'secondary-nav-icon' +
      (navPosition === 2 ? ' secondary-nav-icon-future-active' : ''),
    'secondary-nav-icon' +
      (navPosition === 3 ? ' secondary-nav-icon-live-active' : '')
  ];
  function containerIsActive(link) {
    return link === navPosition
      ? 'col-xs-4 secondary-nav-icon-container secondary-nav-icon-container-active'
      : 'col-xs-4 secondary-nav-icon-container';
  }

  return (
    <div className="navbar-secondary">
      <div className="row nav-icons">
        <div className={containerIsActive(0)} onClick = {() => handleNavPositionChange(0)}>
          <AllTimingsIcon
            className={classNames[0]}
            onClick={() => handleNavPositionChange(0)}
          />
          <span className="icon-title">All</span>
        </div>
        <div className={containerIsActive(1)} onClick = {() => handleNavPositionChange(1)}>
          <PastIcon
            className={classNames[1]}
            onClick={() => handleNavPositionChange(1)}
          />
          <span className="icon-title">Past</span>
        </div>
        <div className={containerIsActive(2)} onClick = {() => handleNavPositionChange(2)}>
          <FutureIcon
            className={classNames[2]}
            onClick={() => handleNavPositionChange(2)}
          />
          <span className="icon-title">Future</span>
        </div>
        <div className={containerIsActive(3)} onClick = {() => handleNavPositionChange(3)}>
          <LiveIcon
            className={classNames[3]}
            onClick={() => handleNavPositionChange(3)}
          />
          <span className="icon-title">Live</span>
        </div>
      </div>
    </div>
  );
}

PromptNavMenu.propTypes = {
  handleNavPosition: PropTypes.func
}

export default withMemo(PromptNavMenu, []);
