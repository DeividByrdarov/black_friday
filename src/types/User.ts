export default interface User {
  id: string
  name: string
  username: string
  role: Role
}

export type Role = "CUSTOMER" | "ADMIN"
