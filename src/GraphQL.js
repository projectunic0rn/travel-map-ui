import gql from "graphql-tag";

//QUERIES

export const GET_ALL_USER_COUNTRIES = gql`
  query {
    users {
      username
      Places_visited {
        id
        country
        countryId
        countryISO
        city
        cityId
        city_latitude
        city_longitude
      }
      Places_visiting {
        id
        country
        countryId
        countryISO
        city
        cityId
        city_latitude
        city_longitude
      }
      Place_living {
        id
        country
        countryId
        countryISO
        city
        cityId
        city_latitude
        city_longitude
      }
    }
  }
`;

export const GET_LOGGEDIN_USER_COUNTRIES = gql`
  query {
    getLoggedInUser {
      id
      Places_visited {
        id
        country
        countryId
        countryISO
        city
        cityId
        city_latitude
        city_longitude
      }
      Places_visiting {
        id
        country
        countryId
        countryISO
        city
        cityId
        city_latitude
        city_longitude
      }
      Place_living {
        id
        country
        countryId
        countryISO
        city
        cityId
        city_latitude
        city_longitude
      }
    }
  }
`;

export const GET_LOGGEDIN_USER = gql`
  query getLoggedInUser {
    getLoggedInUser {
      id
      username
    }
  }
`;

//MUTATIONS
export const ADD_PLACE_VISITED = gql`
  mutation addPlaceVisited($country: Country!, $cities: [City!]) {
    addPlaceVisited(country: $country, cities: $cities) {
      id
      country
      city
      cityId
      city_latitude
      city_longitude
    }
  }
`;

export const ADD_PLACE_VISITING = gql`
  mutation addPlaceVisiting($country: Country!, $cities: [City!]) {
    addPlaceVisiting(country: $country, cities: $cities) {
      id
      country
      city
      cityId
      city_latitude
      city_longitude
    }
  }
`;

export const REMOVE_PLACE_VISITING = gql`
  mutation removePlaceVisiting($placeVisitingId: Int!) {
    removePlaceVisiting(placeVisitingId: $placeVisitingId) {
      id
    }
  }
`;

export const ADD_PLACE_LIVING = gql`
  mutation addPlaceLiving($country: Country!, $cities: [City!]) {
    addPlaceLiving(country: $country, cities: $cities) {
      id
      country
      city
      cityId
      city_latitude
      city_longitude
    }
  }
`;

// This will depend on how the UI is laid out
export const UPDATE_PLACE_LIVING = gql`
  mutation updatePlaceLiving($country: Int!, $cities: Int!) {
    updatePlaceLiving(country: $country, cities: $city) {
      id
      country
      city
    }
  }
`;

export const REMOVE_PLACE_VISITED = gql`
  mutation removePlaceVisited($placeVisitedId: Int!) {
    removePlaceVisited(placeVisitedId: $placeVisitedId) {
      id
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      token
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation registerUser(
    $username: String!
    $fullName: String!
    $email: String!
    $password: String!
  ) {
    registerUser(
      username: $username
      full_name: $fullName
      email: $email
      password: $password
    ) {
      token
    }
    loginUser(username: $username, password: $password) {
      token
    }
  }
`;
