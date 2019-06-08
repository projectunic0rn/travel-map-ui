import React from "react";
import PropTypes from "prop-types";

function ClickedCountryTiming(props) {
    return (
        <div className = 'clicked-country-timing-container'>
            <span onClick = {() => props.handleTripTiming(0)}>I visited here</span>
            <span onClick = {() => props.handleTripTiming(1)}>I plan to visit here</span>
            <span onClick = {() => props.handleTripTiming(2)}>I live here currently</span>
        </div>
    )
}

ClickedCountryTiming.propTypes = {
    handleTripTiming: PropTypes.func
}

export default ClickedCountryTiming;