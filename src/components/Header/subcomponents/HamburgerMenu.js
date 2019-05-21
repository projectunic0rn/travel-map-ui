import React from "react";
import PropTypes from 'prop-types';

const { useState } = React;


export default function HamburgerMenu(props) {
    const [showHamburger, handleHamburger] = useState(props.showHamburger);
    function handleHamburgerClick(val) {
      handleHamburger(val);
      props.handleHamburgerClick(val);
    }
    function hamburgerClasses() {
      return (props.showHamburger) ? 'hamburger-icon ham-active' : 'hamburger-icon';
    }
    return (
      <div className = {hamburgerClasses()} id ="ham" onClick={()=> handleHamburgerClick(!showHamburger)}>
        <span className = 'hamburger-a'/>
        <span className = 'hamburger-b'/>
      </div>
    )
  }

  HamburgerMenu.propTypes = {
    showHamburger: PropTypes.number, 
    handleHamburgerClick: PropTypes.func
  }