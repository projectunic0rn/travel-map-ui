import React from "react";
import PropTypes from "prop-types";

function ClickedCountryTiming(props) {
    return (
        <div className = 'clicked-country-timing-container'>
            <span onClick = {() => props.handleTripTiming(0)}>I visited here</span>
            <span onClick = {() => props.handleTripTiming(1)}>I plan to visit here</span>
            <span onClick = {() => props.handleTripTiming(2)}>I live here currently</span>
            {(props.previousTrips) ? <div className = 'previous-trips-button'>delete trips</div> : null}
        </div>
    )
}

ClickedCountryTiming.propTypes = {
    handleTripTiming: PropTypes.func,
    previousTrips: PropTypes.bool
}

export default ClickedCountryTiming;