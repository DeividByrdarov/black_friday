import { gql } from "apollo-boost"
import User from "../../types/User"

export interface updateUserMutationData {
  updateUser: User
}

export const UPDATE_USER_MUTATION = gql`
mutation updateUser($id: ID!, $name: String!, $username: String!, $role: Role) {
  updateUser(id: $id, name: $name, username: $username, role: $role) {
    id
  }
}
`