import { gql } from "apollo-boost"

export const DELETE_USER_SESSION_MUTATION = gql`
mutation deleteUserSession($userSessionId: String!) {
  deleteUserSession(userSessionId: $userSessionId)
}
`