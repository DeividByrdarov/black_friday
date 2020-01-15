import produce from "immer"
import { AnyAction } from "redux"

import { LOGIN, LOGOUT } from "../actions/UserActions"
import { Role } from "../../types/User"

type State = {
  [key in Role]: {
  userSessionId: string
  expireAt: string
} | null
}

const initialState: State = {
  CUSTOMER: null,
  ADMIN: null,
}

const userReducer = (state = initialState, action: AnyAction) =>
  produce(state, draft => {
    switch (action.type) {
      case LOGIN.INTERNAL:
        // @ts-ignore
        draft[action.payload.user.role] = {
          userSessionId: action.payload.id,
          expireAt: action.payload.expireAt,
        }
        return
      case LOGOUT.INTERNAL:
        // @ts-ignore
        draft[action.payload] = null
        return
      default:
        return state
    }
  })

export default userReducer