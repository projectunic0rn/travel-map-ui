import './utils/wdyr';

import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import jwt_decode from "jwt-decode";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import ReactGA from "react-ga";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";

import * as serviceWorker from "./serviceWorker";

const App = lazy(() => import("./App"));
const FriendReadonlyMap = lazy(() => import("./pages/Home/FriendReadonlyMap"));
const NewUserMap = lazy(() => import("./pages/Home/NewUserMap"));

require("dotenv").config();

Bugsnag.start({
  apiKey: "51669e2486c775864ec756656998ad34",
  plugins: [new BugsnagPluginReact()],
});

var ErrorBoundary = Bugsnag.getPlugin("react").createErrorBoundary(React);

const trackingId = "UA-156249933-1"; // Replace with your Google Analytics tracking ID
ReactGA.initialize(trackingId);

const history = createBrowserHistory();

history.listen((location) => {
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

let userAuthenticated = false;
// Check if the user is logged in
if (localStorage.getItem("token")) {
  // Decode the token
  const decoded = jwt_decode(localStorage.token);
  userAuthenticated = true;

  // Get current time as a timestamp
  const currentTime = new Date().getTime() / 1000;

  // Add 1 hour to the creation time of the token
  const expirationTime = decoded.iat + 3600;
  if (currentTime > expirationTime) {
    localStorage.removeItem("token");
    userAuthenticated = false;
  }
}

let clientUrl = "";
if (process.env.NODE_ENV === "production" || process.env.REACT_APP_API === "PROD") {
  clientUrl = process.env.REACT_APP_PROD_API_URL;
} else if (process.env.REACT_APP_TEST_API_URL != null) {
  clientUrl = process.env.REACT_APP_TEST_API_URL;
} else if (process.env.REACT_APP_API === "DEV") {
  clientUrl = process.env.REACT_APP_DEV_API_URL;
}

const client = new ApolloClient({
  uri: clientUrl,
  request: async (operation) => {
    {
      const token = await localStorage.getItem("token");
      operation.setContext({
        headers: {
          authorization: token ? token : "",
        },
      });
    }
  },
});

ReactDOM.render(
  <ErrorBoundary>
    <ApolloProvider client={client}>
      <Router history={history}>
        <Switch>
          <Suspense fallback={<div></div>}>
            <Route path="/new/" component={NewUserMap} />
            <Route path="/public" component={FriendReadonlyMap} />
            <Route
              path="/"
              render={(props) => (
                <App
                  {...props}
                  userAuthenticated={localStorage.getItem("token") !== null}
                />
              )}
            />
          </Suspense>
        </Switch>
      </Router>
    </ApolloProvider>
  </ErrorBoundary>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
