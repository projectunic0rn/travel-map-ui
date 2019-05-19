import React from 'react';
import PropTypes from 'prop-types';
import CalendarIcon from '../../../../icons/CalendarIcon';
import CityIcon from '../../../../icons/CityIcon';

export default function CountryResult(props) {
  const { name, days, city, year } = props;
  return (
    <div className="result-country">
      <div className="country-icon"></div>
      <div className="country-name">{ name }</div>
      <div className="day-count"><CalendarIcon/>{ days }</div>
      <div className="city-count"><CityIcon />{ city }</div>
      <div className="year"><span>{ year }</span></div>
    </div>
  )
}

CountryResult.propTypes = {
  name: PropTypes.string,
  days: PropTypes.number,
  city: PropTypes.number,
  year: PropTypes.number
}
