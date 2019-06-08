import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

let clientUrl = '';
switch(process.env.NODE_ENV) {
  case "development":
    clientUrl = "https://travel-map-api-dev.herokuapp.com/graphql"
    break;
  case "test":
    clientUrl = "https://travel-map-api-staging.herokuapp.com/graphql"
    break;
  case "production":
    clientUrl = "https://travel-map-api-prod.herokuapp.com/graphql"
}
  const client = new ApolloClient({
    uri: clientUrl,
    request: async operation => {
    {
      const token = await localStorage.getItem('token');
      operation.setContext({
          headers: {
              authorization: (token) ? token : ''
          },
      });
  }}
  });

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
