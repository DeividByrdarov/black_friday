import { gql } from "apollo-boost"

export interface deleteUserMutationData {
  deleteUser: boolean
}

export const DELETE_USER_MUTATION = gql`
mutation deleteUser($userId: String!) {
  deleteUser(userId: $userId)
}
`