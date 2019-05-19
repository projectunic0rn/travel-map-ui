import React from 'react';
import CountryResult from './CountryResult';
import AllTimingsIcon from '../../../../icons/AllTimingsIcon';
import PastIcon from '../../../../icons/PastIcon';
import FutureIcon from '../../../../icons/FutureIcon';
import LiveIcon from '../../../../icons/LiveIcon';

export default function Trips() {
  let fakeresults = [
    {
      id: 1,
      name: 'China',
      days: 10,
      city: 20,
      year: 2005
    },
    {
      id: 2,
      name: 'Else',
      days: 11,
      city: 21,
      year: 2006
    },
    {
      id: 3,
      name: 'Some',
      days: 12,
      city: 22,
      year: 2007
    },
    {
      id: 4,
      name: 'China',
      days: 10,
      city: 20,
      year: 2005
    },
    {
      id: 5,
      name: 'Else',
      days: 11,
      city: 21,
      year: 2006
    },
    {
      id: 6,
      name: 'Some',
      days: 12,
      city: 22,
      year: 2007
    }
  ];
  // fakeresults = [...gfakeresults, ...fakeresults, ...fakeresults];
  return (
    <div className="content content-trips-page">
      <div className="sidebar-filter">
        <a href="#" className="active"><AllTimingsIcon /> all types</a>
        <a href="#"><PastIcon /> past</a>
        <a href="#"><FutureIcon /> future</a>
        <a href="#"><LiveIcon /> live</a>
      </div>
      <div className="content-results">
        {
          fakeresults.map(country => (
            <CountryResult
              key={country.id}
              name={country.name}
              days={country.days}
              city={country.city}
              year={country.year}
            />
          ))
        }
      </div>
    </div>
  )
}
