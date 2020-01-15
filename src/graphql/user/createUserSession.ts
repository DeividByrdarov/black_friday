import { gql } from "apollo-boost"

import UserSession from "../../types/UserSession"

export interface createUserSessionMutationData {
  createUserSession: UserSession
}

export const CREATE_USER_SESSION_MUTATION = gql`
mutation createUserSession($username: String!, $password: String!) {
  createUserSession(username: $username, password: $password) {
    id
    user {
      role
    }
    expireAt
  }
}
`