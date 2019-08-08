import React from "react";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  let facts = [
    "France was the most visited country in 2018",
    "The average person travels to 14 countries in their lifetime",
    "Travel will decrease your risk of heart disease",
    "60% of the world's lakes are located in Canada",
    "Parts of the Great Wall of China are made with sticky rice"
  ];
  return (
    <div className="page-not-found container">
      <h1>404 - This link is broken :(</h1>
      <p>
        Go back to the <Link to="/">homepage</Link>
      </p>
      <h2>Did you know that</h2>
      <ul>{facts[Math.floor(Math.random() * facts.length)]}</ul>
    </div>
  );
}
