import React from 'react';
import CountryResult from './CountryResult';

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
        <a href="#" className="active">all types</a>
        <a href="#">past</a>
        <a href="#">future</a>
        <a href="#">lived</a>
        <a href="#">live</a>
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
