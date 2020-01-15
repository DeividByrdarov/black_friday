import { gql } from "apollo-boost"

import User from "../../types/User"

export interface createUserMutationData {
  createUser: User
}

export const CREATE_USER_MUTATION = gql`
mutation createUser($name: String!, $username: String!, $password: String!, $repeatPassword: String!, $role: Role = CUSTOMER) {
  createUser(name: $name, username: $username, password: $password, repeatPassword: $repeatPassword, role: $role) {
    id
  }
}
`

