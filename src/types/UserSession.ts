import User from "./User"

export default interface UserSession {
  id: string
  user: User
  expireAt: Date
  createdAt: Date
}
