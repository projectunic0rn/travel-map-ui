import gql from "graphql-tag";

//QUERIES
export const GET_LOGGEDIN_USER_COUNTRIES = gql`
  query {
    getLoggedInUser {
      id
      Places_visited {
        id
        country
      }
      Places_visiting {
        id
        country
      }
      Place_living {
        id
        country
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
  mutation addPlaceVisited($country: Int!, $city: Int!) {
    addPlaceVisited(country: $country, city: $city) {
      id
      country
    }
  }
`;

export const ADD_PLACE_VISITING = gql`
  mutation addPlaceVisiting($country: Int!, $city: Int!) {
    addPlaceVisiting(country: $country, city: $city) {
      id
      country
    }
  }
`;

export const ADD_PLACE_LIVING = gql`
  mutation addPlaceLiving($country: Int!, $city: Int!) {
    addPlaceLiving(country: $country, city: $city) {
      id
      country
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
