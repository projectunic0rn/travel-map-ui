import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import SimpleLoader from "../../../components/common/SimpleLoader/SimpleLoader";

export default function ImportPopup(props) {
  const [taUrl, handleTaUrl] = useState("");
  const [importComplete, handleImportComplete] = useState(false);
  const [importStarted, handleImportStarted] = useState(false);
  const [importedCities, handleImportedCities] = useState([]);
  const [unimportedCities, handleUnimportedCities] = useState([]);

  useEffect(() => {
    if (importedCities.length > 0) {
      fetchMapbox();
    }
  }, [importedCities]);

  function importTripAdvisor() {
    if (taUrl.length > 0) {
      handleImportStarted(true);
    }
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    if (taUrl.length < 1) {
      return;
    }
    let getStringBetween = function(str, start, end) {
      "use strict";
      var left = str.substring(str.indexOf(start) + start.length);
      return left.substring(left.indexOf(end), -left.length);
    };
    (async () => {
      const Response = await fetch(proxyUrl + taUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4",
          "Upgrade-Insecure-Requests": "1",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"
        },
        body: JSON.stringify({})
      });
      if (Response.status === 404) {
        handleImportStarted(false);
        alert("That url does not work, try again!");
        return;
      }
      const html = await Response.text();
      var taPlaces = JSON.parse(
        '{"' +
          getStringBetween(
            html,
            '"store":{"',
            ',"modules.membercenter.model.FriendCount'
          ) +
          "}"
      )["modules.unimplemented.entity.LightWeightPin"];
      let taPlacesArray = Object.values(taPlaces);
      for (let i in taPlacesArray) {
        if (taPlacesArray[i].flags.indexOf("fave") !== -1) {
          taPlacesArray[i].flags.splice(
            taPlacesArray[i].flags.indexOf("fave"),
            1
          );
        }
      }
      handleImportedCities(taPlacesArray);
    })();
  }

  function fetchMapbox() {
    let importedCitiesFormatted = [];
    let loading = false;
    for (let i = 0; i < importedCities.length; i++) {
      let timing;
      let longLat = importedCities[i].lng + ", " + importedCities[i].lat;
      switch (importedCities[i].flags.toString()) {
        case "been":
          timing = 0;
          break;
        case "want":
          timing = 1;
          break;
        case "been,want":
          timing = 3;
          importedCities[i].flags.splice(0, 1);
          importedCities.splice(i, 0, importedCities[i]);
          break;
        case "want,been":
          timing = 3;
          importedCities[i].flags.splice(1, 1);
          importedCities.splice(i, 0, importedCities[i]);
          break;
        default:
          break;
      }
      fetch(
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
          longLat +
          ".json?types=place&access_token=pk.eyJ1IjoibXZhbmNlNDM3NzYiLCJhIjoiY2pwZ2wxMnJ5MDQzdzNzanNwOHhua3h6cyJ9.xOK4SCGMDE8C857WpCFjIQ"
      )
        .then(res => res.json())
        .then(result => {
          if (result.features.length < 1) {
            let newUnimportedCities = unimportedCities;
            if (newUnimportedCities.indexOf(importedCities[i].name) === -1) {
              newUnimportedCities.push(importedCities[i].name);
              handleUnimportedCities(newUnimportedCities);
            }
          }
          let sortedResult = result.features.sort((a, b) => {
            if (
              a.properties.wikidata !== undefined &&
              b.properties.wikidata !== undefined
            ) {
              return (
                a.properties.wikidata.length - b.properties.wikidata.length
              );
            }
          });
          let formattedCity;
          loading = true;
          if (timing === 3) {
            formattedCity = handleOnImport({ result: sortedResult[0] }, 0);
          } else {
            formattedCity = handleOnImport({ result: sortedResult[0] }, timing);
          }
          loading = false;
          return formattedCity;
        })
        .then(formattedCity => {
          if (!loading) {
            importedCitiesFormatted.push(formattedCity);
            if (importedCitiesFormatted.length === importedCities.length) {
              props.customProps.handleLoadedCities(importedCitiesFormatted);
              handleImportStarted(false);
              handleImportComplete(true);
            }
          }
        });
    }
  }
  function handleOnImport(event, timing) {
    let country = "";
    let countryISO = "";
    let context = 0;
    let cityId;
    try {
      for (let i in event.result.context) {
        context = 0;
        if (event.result.context.length === 1) {
          countryISO = event.result.context[0].short_code.toUpperCase();
          country = event.result.context[0]["text"];
        }
        if (event.result.context[i].id.slice(0, 7) === "country") {
          context = i;
          country = event.result.context[i]["text"];
          countryISO = event.result.context[i]["short_code"].toUpperCase();
        }
      }
      if (event.result.properties.wikidata !== undefined) {
        cityId = parseFloat(event.result.properties.wikidata.slice(1), 10);
      } else {
        cityId = parseFloat(event.result.id.slice(10, 16), 10);
      }

      let newCity = {
        country:
          event.result.context !== undefined
            ? country
            : event.result.place_name,
        countryId:
          event.result.context !== undefined
            ? parseInt(event.result.context[context].id.slice(8, 14))
            : parseInt(event.result.id.slice(7, 13)),
        countryISO:
          event.result.context !== undefined
            ? countryISO
            : event.result.properties.short_code.toUpperCase(),
        city: event.result.text,
        cityId,
        city_latitude: event.result.center[1],
        city_longitude: event.result.center[0],
        tripTiming: timing
      };
      return newCity;
    } catch (err) {
      return undefined;
    }
  }
  return (
    <div className="import-container">
      <span className="import-container-title">Import Data</span>
      <div className="import-sub-container" id="ta-import">
        <span className="import-title" id="ta-title">
          TRIP ADVISOR <span className="import-example">(Travel Map URL)</span>
        </span>
        <input
          type="text"
          className="import-input input"
          id="ta-input"
          onChange={e => handleTaUrl(e.target.value)}
          placeholder="https://www.tripadvisor.com/TravelMap-a_uid..."
        ></input>

        <button className="button" onClick={importTripAdvisor}>
          Submit
        </button>
      </div>
      {importStarted ? <SimpleLoader /> : null}
      {importComplete ? (
        <div className="import-results-container">
          <span className="import-results-title">Unable to import</span>
          {unimportedCities.map(city => {
            return <span key={city}>{city}</span>;
          })}
        </div>
      ) : null}
    </div>
  );
}

ImportPopup.propTypes = {
  customProps: PropTypes.object
};
