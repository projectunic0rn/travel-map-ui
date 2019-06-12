import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

require('dotenv').config();

let clientUrl = '';
if (process.env.REACT_APP_PROD_API_URL != null) {
  clientUrl = process.env.REACT_APP_PROD_API_URL;
} else if (process.env.REACT_APP_TEST_API_URL != null) {
  clientUrl = process.env.REACT_APP_TEST_API_URL;
} else {
  clientUrl = process.env.REACT_APP_DEV_API_URL;
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
