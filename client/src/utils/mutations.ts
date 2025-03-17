import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation signup($username: String!, $password: String!) {
    signup(username: $username, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const PLACE_PIXEL = gql`
  mutation placePixel($x: Int!, $y: Int!, $color: String!) {
    placePixel(x: $x, y: $y, color: $color)
  }
`;
