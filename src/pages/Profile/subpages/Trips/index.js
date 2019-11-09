import React, { useState, useEffect } from "react";
import _ from "lodash";
import CountryResult from "./CountryResult";
import AllTimingsIcon from "../../../../icons/AllTimingsIcon";
import PastIcon from "../../../../icons/PastIcon";
import FutureIcon from "../../../../icons/FutureIcon";
import LiveIcon from "../../../../icons/LiveIcon";

export default function Trips({ user }) {
  let fakeresults = [
    {
      id: 1,
      name: "Past",
      days: 10,
      city: 20,
      year: 2005,
      state: "past"
    },
    {
      id: 2,
      name: "Future",
      days: 11,
      city: 21,
      year: 2026,
      state: "future"
    },
    {
      id: 3,
      name: "Live",
      days: 12,
      city: 22,
      year: 2007,
      state: "live"
    },
    {
      id: 4,
      name: "China",
      days: 10,
      city: 20,
      year: 2005
    },
    {
      id: 5,
      name: "Else",
      days: 11,
      city: 21,
      year: 2006
    },
    {
      id: 6,
      name: "Some",
      days: 12,
      city: 22,
      year: 2007
    }
  ];

  const [results, setResults] = useState(fakeresults);
  const [filterState, setFilterState] = useState("");

  useEffect(() => console.log(user), [user]);

  function filter(state) {
    setFilterState(state);
    if (!state) {
      return setResults(fakeresults);
    }
    const r = _.filter(fakeresults, { state });
    return setResults(r);
  }

  return (
    <div className="trips content">
      <div className="sidebar-filter">
        <button
          onClick={() => filter()}
          className={!filterState ? "active" : ""}
        >
          <AllTimingsIcon /> all types
        </button>
        <button
          onClick={() => filter("past")}
          className={filterState === "past" ? "active" : ""}
        >
          <PastIcon /> past
        </button>
        <button
          onClick={() => filter("future")}
          className={filterState === "future" ? "active" : ""}
        >
          <FutureIcon /> future
        </button>
        <button
          onClick={() => filter("live")}
          className={filterState === "live" ? "active" : ""}
        >
          <LiveIcon /> live
        </button>{" "}
      </div>
      <div className="content-results">
        {results.map((country) => (
          <CountryResult
            key={country.id}
            name={country.name}
            days={20}
            city="City"
            year="2019"
          />
        ))}
      </div>
    </div>
  );
}
