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

export const CREATE_PIXEL = gql`
  mutation createPixel($x: Int!, $y: Int!, $color: String!) {
    createPixel(x: $x, y: $y, color: $color) {
      userId
      x
      y
      color
      placedAt
    }
  }
`;
