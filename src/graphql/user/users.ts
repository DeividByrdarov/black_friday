import { gql } from "apollo-boost"
import User from "../../types/User"

export interface usersQueryData {
  users: User[]
}

export const USERS_QUERY = gql`
query users {
  users {
    id
    name
    username
    role
  }
}
`